import Tesseract from 'tesseract.js';

let worker = null;

export const initWorker = async () => {
  if (!worker) {
    console.log('Initializing Tesseract worker...');
    worker = await Tesseract.createWorker('eng');
    console.log('Tesseract worker initialized');
  }
  return worker;
};

export const recognizeText = async (imageData, onProgress) => {
  try {
    console.log('Starting recognition...');
    const w = await initWorker();
    
    const result = await w.recognize(imageData);
    
    console.log('Tesseract raw result:', result);
    
    if (onProgress) onProgress(100);

    // Safe access to result data
    const text = result?.data?.text || '';
    const confidence = result?.data?.confidence || 0;
    const words = result?.data?.words || [];
    
    // Extract lines from words
    const lines = words
      .filter(word => word && word.text)
      .map(word => word.text);

    console.log('Extracted text:', text);
    console.log('Confidence:', confidence);
    console.log('Lines:', lines);

    return {
      text: text,
      confidence: confidence,
      lines: lines
    };
  } catch (error) {
    console.error('Tesseract recognition error:', error);
    throw error;
  }
};

export const terminateWorker = async () => {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
};