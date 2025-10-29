import { recognizeText } from './tesseractWorker';

// Configuration for which AI service to use
const AI_SERVICE = 'tesseract'; // Options: 'tesseract', 'google', 'openai'

// ========================================
// TESSERACT.JS (100% FREE)
// ========================================

export const extractTextWithTesseract = async (imageData, onProgress = null) => {
  try {
    console.log('🔍 Starting Tesseract OCR...');
    
    if (onProgress) onProgress(10);
    
    const result = await recognizeText(imageData, (progress) => {
      if (onProgress) {
        onProgress(10 + (progress * 0.8));
      }
    });

    if (onProgress) onProgress(100);

    console.log('✅ Tesseract result:', result);
    return result;
  } catch (error) {
    console.error('❌ Tesseract error:', error);
    throw error;
  }
};

// ========================================
// SMART TEXT PARSING
// ========================================

export const parseBottleInfo = (text) => {
  console.log('📝 Parsing text:', text);
  
  if (!text || typeof text !== 'string') {
    console.warn('No valid text to parse');
    return {
      name: null,
      producer: null,
      vintage: null,
      type: null,
      region: null,
      alcohol: null
    };
  }
  
  const lines = text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);
  
  console.log('📋 Lines:', lines);
  
  const info = {
    name: null,
    producer: null,
    vintage: null,
    type: null,
    region: null,
    alcohol: null
  };

  // Find vintage year (4 digits between 1900-2099)
  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    info.vintage = yearMatch[0];
    console.log('📅 Found vintage:', info.vintage);
  }

  // Find alcohol percentage
  const alcoholMatch = text.match(/(\d+(?:\.\d+)?)\s*%(?:\s*(?:vol|alc|ABV))?/i);
  if (alcoholMatch) {
    info.alcohol = alcoholMatch[1] + '%';
    console.log('🍷 Found alcohol:', info.alcohol);
  }

  // Detect wine types
  const wineTypes = ['Cabernet', 'Merlot', 'Pinot Noir', 'Chardonnay', 'Sauvignon', 'Riesling', 'Syrah', 'Malbec', 'Zinfandel', 'Pinot Grigio'];
  const whiskeyTypes = ['Bourbon', 'Scotch', 'Whisky', 'Whiskey', 'Rye', 'Single Malt', 'Blended'];
  const spiritTypes = ['Vodka', 'Gin', 'Rum', 'Tequila', 'Mezcal', 'Cognac', 'Brandy'];
  
  for (const type of [...wineTypes, ...whiskeyTypes, ...spiritTypes]) {
    if (text.toLowerCase().includes(type.toLowerCase())) {
      info.type = type;
      console.log('🏷️ Found type:', info.type);
      break;
    }
  }

  // Use first substantial line as potential name
  if (lines.length > 0) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip very short lines and year-only lines
      if (line.length > 2 && !line.match(/^\d{4}$/) && line.length < 60) {
        if (!info.name) {
          info.name = line;
          console.log('📛 Found name:', info.name);
        } else if (!info.producer && line !== info.name) {
          info.producer = line;
          console.log('🏢 Found producer:', info.producer);
          break;
        }
      }
    }
  }

  // If we found nothing, use first line as name
  if (!info.name && lines.length > 0) {
    info.name = lines[0];
    console.log('📛 Using first line as name:', info.name);
  }

  console.log('✅ Final parsed info:', info);
  return info;
};

// ========================================
// MAIN EXTRACTION FUNCTION
// ========================================

export const extractBottleInfo = async (imageData, onProgress = null) => {
  console.log('🚀 Starting extraction with:', AI_SERVICE);

  let result;

  try {
    if (onProgress) onProgress(5);

    // Use configured AI service
    if (AI_SERVICE === 'tesseract') {
      result = await extractTextWithTesseract(imageData, onProgress);
    } else {
      throw new Error(`AI service ${AI_SERVICE} not implemented`);
    }

    console.log('📊 Raw extraction result:', result);

    // Always parse the text
    const parsed = parseBottleInfo(result.text);
    result.parsed = parsed;

    console.log('🎯 Final result with parsed data:', result);
    return result;
  } catch (error) {
    console.error('💥 Vision extraction failed:', error);
    
    // Return empty result instead of throwing
    return {
      text: '',
      confidence: 0,
      lines: [],
      parsed: {
        name: null,
        producer: null,
        vintage: null,
        type: null,
        region: null,
        alcohol: null
      }
    };
  }
};