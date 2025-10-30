/**
 * Google Cloud Vision API Service
 * Uses REST API for web compatibility
 * WITH LIQUOR KNOWLEDGE DATABASE INTEGRATION ✨
 */
import { enrichLiquorData } from './liquorKnowledgeDatabase';

const API_KEY = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

/**
 * Extract text from image using Google Cloud Vision API
 * @param {string} imageDataUrl - Base64 encoded image data URL
 * @param {Function} onProgress - Progress callback (0-100)
 * @param {string} category - Category type ('wine', 'whiskey', 'cocktail', etc.)
 * @returns {Promise<Object>} Extracted text and confidence
 */
export async function extractTextFromImage(imageDataUrl, onProgress = () => {}, category = 'wine') {
  try {
    // Validate API key
    if (!API_KEY || API_KEY === 'your_actual_api_key_here') {
      throw new Error('Google Vision API key not configured. Please add VITE_GOOGLE_VISION_API_KEY to your .env file');
    }

    onProgress(10, 'Preparing image...');

    // Convert data URL to base64 (remove data:image/jpeg;base64, prefix)
    const base64Image = imageDataUrl.split(',')[1];

    onProgress(30, 'Sending to Google Vision...');

    // Make API request
    const response = await fetch(VISION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'DOCUMENT_TEXT_DETECTION', // Best for dense text like labels
                maxResults: 1,
              },
              {
                type: 'LOGO_DETECTION', // Detect brand logos
                maxResults: 5,
              },
            ],
            imageContext: {
              languageHints: ['en', 'fr', 'it', 'es', 'de'], // Common wine label languages
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Vision API request failed');
    }

    onProgress(70, 'Processing results...');

    const data = await response.json();
    const result = data.responses[0];

    // Extract text
    const fullText = result.fullTextAnnotation?.text || '';
    
    // Extract logos (brand names)
    const logos = result.logoAnnotations?.map(logo => logo.description) || [];

    onProgress(80, 'Analyzing text...');

    // Parse the extracted text (YOUR EXISTING FUNCTION)
    const extracted = parseExtractedText(fullText, logos);

    onProgress(85, 'Searching knowledge database...');

    // ✨ NEW: Enrich with knowledge database
    const enriched = enrichLiquorData(extracted, category);

    onProgress(100, 'Complete!');

    return {
      success: true,
      text: fullText,
      logos,
      extracted: enriched, // Return enriched data instead of raw extracted
      confidence: calculateConfidence(result),
      enriched: enriched.enriched || false, // Flag if database match found
      enrichmentConfidence: enriched.enrichmentConfidence || 0,
    };

  } catch (error) {
    console.error('Google Vision API Error:', error);
    return {
      success: false,
      error: error.message,
      extracted: null,
    };
  }
}

/**
 * Parse extracted text into structured data
 * @param {string} text - Raw OCR text
 * @param {string[]} logos - Detected brand logos
 * @returns {Object} Structured drink information
 */
function parseExtractedText(text, logos = []) {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  const extracted = {
    name: null,
    producer: null,
    vintage: null,
    type: null,
    region: null,
    abv: null,
  };

  // Extract vintage (4-digit year between 1900-2030)
  const vintageMatch = text.match(/\b(19[5-9]\d|20[0-2]\d|2030)\b/);
  if (vintageMatch) {
    extracted.vintage = vintageMatch[0];
  }

  // Extract ABV (alcohol percentage)
  const abvMatch = text.match(/(\d{1,2}(?:\.\d)?)\s*%\s*(?:alc|vol|ABV)?/i);
  if (abvMatch) {
    extracted.abv = `${abvMatch[1]}%`;
  }

  // Use detected logos as producer
  if (logos.length > 0) {
    extracted.producer = logos[0];
  }

  // Extract producer and name from text
  if (lines.length > 0) {
    // First substantial line is usually the name or producer
    extracted.name = lines[0].trim();
    
    if (lines.length > 1) {
      // Second line might be producer if no logo detected
      if (!extracted.producer) {
        extracted.producer = lines[1].trim();
      }
    }
  }

  // Detect wine type
  extracted.type = detectType(text);

  // Detect region
  extracted.region = detectRegion(text);

  return extracted;
}

/**
 * Detect drink type from text
 * @param {string} text - OCR text
 * @returns {string|null} Detected type
 */
function detectType(text) {
  const lower = text.toLowerCase();

  // Wine types
  if (lower.match(/\b(cabernet|merlot|pinot noir|syrah|malbec|grenache|zinfandel)\b/)) {
    return 'Red Wine';
  }
  if (lower.match(/\b(chardonnay|sauvignon blanc|riesling|pinot grigio|pinot gris)\b/)) {
    return 'White Wine';
  }
  if (lower.match(/\b(rosé|rose)\b/)) {
    return 'Rosé';
  }
  if (lower.match(/\b(champagne|prosecco|cava|sparkling)\b/)) {
    return 'Sparkling Wine';
  }

  // Whiskey types
  if (lower.match(/\b(bourbon|scotch|whiskey|whisky|rye)\b/)) {
    return 'Whiskey';
  }

  // Spirits
  if (lower.match(/\b(gin|vodka|rum|tequila|mezcal)\b/)) {
    return 'Spirit';
  }

  return null;
}

/**
 * Detect wine region from text
 * @param {string} text - OCR text
 * @returns {string|null} Detected region
 */
function detectRegion(text) {
  const regions = [
    'bordeaux', 'burgundy', 'champagne', 'rhone', 'loire', 'alsace', // France
    'napa valley', 'sonoma', 'paso robles', 'willamette valley', // USA
    'tuscany', 'piedmont', 'veneto', 'sicily', 'barolo', 'chianti', // Italy
    'rioja', 'priorat', 'ribera del duero', // Spain
    'marlborough', 'central otago', 'hawke\'s bay', // New Zealand
    'barossa valley', 'margaret river', 'yarra valley', // Australia
    'douro', 'alentejo', // Portugal
    'mosel', 'rheingau', 'pfalz', // Germany
  ];

  const lower = text.toLowerCase();
  
  for (const region of regions) {
    if (lower.includes(region)) {
      // Capitalize properly
      return region.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  }

  return null;
}

/**
 * Calculate overall confidence score
 * @param {Object} result - Vision API result
 * @returns {number} Confidence score (0-100)
 */
function calculateConfidence(result) {
  if (!result.fullTextAnnotation) return 0;
  
  // Average confidence of all detected words
  const pages = result.fullTextAnnotation.pages || [];
  let totalConfidence = 0;
  let wordCount = 0;

  pages.forEach(page => {
    page.blocks?.forEach(block => {
      block.paragraphs?.forEach(paragraph => {
        paragraph.words?.forEach(word => {
          totalConfidence += word.confidence || 0;
          wordCount++;
        });
      });
    });
  });

  return wordCount > 0 ? Math.round((totalConfidence / wordCount) * 100) : 0;
}

/**
 * Test if API key is valid
 * @returns {Promise<boolean>} True if API key works
 */
export async function testGoogleVisionAPI() {
  try {
    if (!API_KEY || API_KEY === 'your_actual_api_key_here') {
      console.error('❌ Google Vision API key not configured');
      return false;
    }

    // Test with a simple request
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const base64 = testImage.split(',')[1];

    const response = await fetch(VISION_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{ image: { content: base64 }, features: [{ type: 'TEXT_DETECTION' }] }]
      }),
    });

    if (response.ok) {
      console.log('✅ Google Vision API key is valid');
      return true;
    } else {
      console.error('❌ Google Vision API key is invalid');
      return false;
    }
  } catch (error) {
    console.error('❌ Google Vision API test failed:', error);
    return false;
  }
}