import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { getCameraStream, captureImage, stopCameraStream, compressImage, selectImageFromFile, hasCamera } from '../../utils/cameraUtils';
import { extractBottleInfo } from '../../services/visionService';

export function ScanScreen({ isOpen, onClose, onCapture, category }) {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [extractedInfo, setExtractedInfo] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    }
    return () => {
      if (stream) {
        stopCameraStream(stream);
      }
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!hasCamera()) {
        setError('camera_unavailable');
        setLoading(false);
        return;
      }

      const cameraStream = await getCameraStream('environment');
      setStream(cameraStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Camera error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCapture = async () => {
    if (videoRef.current) {
      const imageData = captureImage(videoRef.current);
      const compressed = await compressImage(imageData);
      setCapturedImage(compressed);
      
      // Stop camera when image captured
      if (stream) {
        stopCameraStream(stream);
        setStream(null);
      }

      // Start AI processing immediately
      await processImage(compressed);
    }
  };

  const processImage = async (imageData) => {
    console.log('📸 Starting AI processing...');
    setProcessing(true);
    setProcessingProgress(0);
    
    try {
      const result = await extractBottleInfo(imageData, (progress) => {
        console.log('📊 Progress:', progress);
        setProcessingProgress(Math.round(progress));
      });
      
      console.log('✅ Processing complete:', result);
      
      // Check if we got any useful data
      const hasData = result.parsed && (
        result.parsed.name || 
        result.parsed.producer || 
        result.parsed.vintage ||
        result.parsed.type
      );
      
      if (hasData) {
        setExtractedInfo(result.parsed);
      } else {
        console.log('⚠️ No useful data extracted');
        setExtractedInfo(null);
      }
      
      setProcessing(false);
    } catch (err) {
      console.error('❌ Processing error:', err);
      setProcessing(false);
      setExtractedInfo(null);
      // Continue anyway - user can manually enter
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setExtractedInfo(null);
    setProcessingProgress(0);
    startCamera();
  };

  const handleUseImage = () => {
    onCapture({
      photo: capturedImage,
      extracted: extractedInfo
    });
    handleClose();
  };

  const handleFileSelect = async () => {
    try {
      const imageData = await selectImageFromFile();
      const compressed = await compressImage(imageData);
      setCapturedImage(compressed);
      
      // Stop camera if running
      if (stream) {
        stopCameraStream(stream);
        setStream(null);
      }
      
      await processImage(compressed);
    } catch (err) {
      console.error('File select error:', err);
    }
  };

  const handleClose = () => {
    if (stream) {
      stopCameraStream(stream);
    }
    setCapturedImage(null);
    setExtractedInfo(null);
    setProcessingProgress(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleClose}
            className="text-white text-sm font-medium hover:text-white/80 transition-colors"
          >
            Skip Scan
          </button>
          <h2 className="text-white font-serif text-lg">Scan Bottle</h2>
          <div className="w-20" />
        </div>
        <p className="text-white/70 text-xs text-center mt-2">
          Center the label in the frame
        </p>
      </div>

      {/* Camera View or Captured Image */}
      <div className="flex-1 relative flex items-center justify-center">
        {loading && (
          <div className="text-white text-center">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-4xl mb-4"
            >
              📸
            </motion.div>
            <p>Starting camera...</p>
          </div>
        )}

        {error === 'camera_unavailable' && (
          <div className="text-white text-center px-6">
            <div className="text-4xl mb-4">📷</div>
            <p className="mb-6">Camera not available on this device</p>
            <Button onClick={handleFileSelect} variant="secondary">
              Select Photo from Library
            </Button>
          </div>
        )}

        {error && error !== 'camera_unavailable' && (
          <div className="text-white text-center px-6">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="mb-2">Camera access denied</p>
            <p className="text-sm text-white/70 mb-6">
              Please enable camera permissions in your browser settings
            </p>
            <Button onClick={handleFileSelect} variant="secondary">
              Select Photo Instead
            </Button>
          </div>
        )}

        {!loading && !error && !capturedImage && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Overlay guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-80 h-96 border-4 border-white/50 rounded-2xl"
              />
            </div>
          </>
        )}

        {capturedImage && (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <img
              src={capturedImage}
              alt="Captured bottle"
              className="max-w-full max-h-full object-contain"
            />

            {/* Processing Overlay - BIG AND VISIBLE */}
            <AnimatePresence>
              {processing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center"
                >
                  <div className="text-white text-center px-8">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      className="text-7xl mb-6"
                    >
                      🔍
                    </motion.div>
                    <h3 className="text-2xl font-serif mb-4">Reading label...</h3>
                    
                    {/* Progress Bar */}
                    <div className="w-64 h-3 bg-white/20 rounded-full overflow-hidden mb-3">
                      <motion.div 
                        className="h-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${processingProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    
                    <p className="text-3xl font-bold mb-2">{processingProgress}%</p>
                    <p className="text-sm text-white/70">Extracting information...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Extracted Info Preview */}
            {extractedInfo && !processing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-xl p-4 shadow-2xl"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✨</span>
                  <div className="flex-1">
                    <p className="text-xs text-slate mb-2 font-semibold">Label Scanned!</p>
                    {extractedInfo.name && (
                      <p className="font-serif font-bold text-charcoal text-lg">{extractedInfo.name}</p>
                    )}
                    {extractedInfo.producer && (
                      <p className="text-sm text-slate mt-1">{extractedInfo.producer}</p>
                    )}
                    <div className="flex gap-3 mt-2">
                      {extractedInfo.vintage && (
                        <span className="text-xs bg-stone/50 px-2 py-1 rounded">{extractedInfo.vintage}</span>
                      )}
                      {extractedInfo.type && (
                        <span className="text-xs bg-stone/50 px-2 py-1 rounded">{extractedInfo.type}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8 pb-12">
        {!capturedImage && !loading && !error && (
          <div className="flex justify-center items-center gap-6">
            <button
              onClick={handleFileSelect}
              className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl hover:bg-white/30 transition-colors"
            >
              🖼️
            </button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCapture}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 border-4 border-charcoal rounded-full" />
            </motion.button>
            <div className="w-14 h-14" />
          </div>
        )}

        {capturedImage && !processing && (
          <div className="flex gap-4">
            <Button onClick={handleRetake} variant="secondary" className="flex-1">
              Retake
            </Button>
            <Button onClick={handleUseImage} className="flex-1">
              {extractedInfo ? '✓ Use Info' : 'Continue'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}