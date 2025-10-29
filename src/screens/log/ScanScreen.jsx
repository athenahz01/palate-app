import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Upload, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { extractTextFromImage } from '../../services/visionService';
import { ComparisonScreen } from './ComparisonScreen';
import { FirstItemCelebration } from './FirstItemCelebration';
import { addItem, loadItems } from '../../utils/storage';

export function ScanScreen({ isOpen, onClose, onCapture, category }) {
  const [mode, setMode] = useState('camera'); // 'camera' | 'upload'
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [extractedInfo, setExtractedInfo] = useState(null);
  const [error, setError] = useState(null);
  
  // NEW: Comparison flow states
  const [showComparison, setShowComparison] = useState(false);
  const [newItem, setNewItem] = useState(null);
  const [showFirstItem, setShowFirstItem] = useState(false);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Start camera
  useEffect(() => {
    if (isOpen && mode === 'camera' && !stream) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, mode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Could not access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    // Create canvas to capture frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    
    setCapturedImage(imageDataUrl);
    
    // Stop camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    // Process image immediately
    processImage(imageDataUrl);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      setCapturedImage(imageDataUrl);
      processImage(imageDataUrl);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageDataUrl) => {
    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      const result = await extractTextFromImage(
        imageDataUrl,
        (percent, message) => {
          setProgress(percent);
          setProgressMessage(message);
        }
      );

      if (result.success) {
        setExtractedInfo(result.extracted);
        console.log('✅ Extraction successful:', result.extracted);
        console.log('📝 Full text:', result.text);
        console.log('🏷️ Logos:', result.logos);
        console.log('💯 Confidence:', result.confidence + '%');
      } else {
        setError(result.error || 'Could not read label. Please try again.');
        console.error('❌ Extraction failed:', result.error);
      }
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Processing error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setExtractedInfo(null);
    setError(null);
    setProgress(0);
    if (mode === 'camera') {
      startCamera();
    }
  };

  // UPDATED: Handle when user confirms the scanned info
  const handleUseImage = () => {
    // Create item data from extracted info
    const itemData = {
      id: Date.now().toString(),
      name: extractedInfo?.name || 'Unknown',
      producer: extractedInfo?.producer || '',
      vintage: extractedInfo?.vintage || '',
      type: extractedInfo?.type || '',
      region: extractedInfo?.region || '',
      abv: extractedInfo?.abv || '',
      category: category,
      photo: capturedImage,
      date: new Date().toISOString(),
    };

    // Load existing items
    const existingItems = loadItems(category);
    
    // First item? Show celebration!
    if (existingItems.length === 0) {
      addItem(category, itemData, 1);
      setNewItem(itemData);
      setShowFirstItem(true); // Show celebration instead of closing
      return;
    }
    
    // Otherwise, show comparison screen
    setNewItem(itemData);
    setShowComparison(true);
  };

  // NEW: Handle completion of comparison flow
  const handleComparisonComplete = ({ rank, wins, losses }) => {
    console.log(`✅ Item ranked at #${rank} (${wins} wins, ${losses} losses)`);
    
    // Add item with determined rank
    const addedItem = addItem(category, newItem, rank);
    console.log('💾 Item saved:', addedItem);
    
    // Call original onCapture if needed for parent component
    if (onCapture) {
      onCapture({
        photo: capturedImage,
        extracted: extractedInfo,
        rank: rank,
        score: addedItem.score
      });
    }
    
    // Reset states
    setNewItem(null);
    setShowComparison(false);
    setCapturedImage(null);
    setExtractedInfo(null);
    
    // Close scan screen
    onClose();
  };

  // NEW: Handle back from comparison screen
  const handleComparisonBack = () => {
    setShowComparison(false);
    setNewItem(null);
    // User can retake or edit the scanned info
  };

  // NEW: Handle continue from first item celebration
  const handleFirstItemContinue = () => {
    // Call original onCapture if needed for parent component
    if (onCapture) {
      onCapture({
        photo: capturedImage,
        extracted: extractedInfo,
        rank: 1,
        score: 10.0
      });
    }
    
    // Reset states
    setShowFirstItem(false);
    setNewItem(null);
    setCapturedImage(null);
    setExtractedInfo(null);
    
    // Close scan screen
    onClose();
  };

  if (!isOpen) return null;

  // NEW: If showing first item celebration
  if (showFirstItem && newItem) {
    return (
      <FirstItemCelebration
        category={category}
        item={newItem}
        onContinue={handleFirstItemContinue}
      />
    );
  }

  // NEW: If in comparison mode, show comparison screen
  if (showComparison && newItem) {
    return (
      <ComparisonScreen
        newItem={newItem}
        existingItems={loadItems(category)}
        category={category}
        onComplete={handleComparisonComplete}
        onBack={handleComparisonBack}
      />
    );
  }

  // Original scan screen UI
  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <button onClick={onClose} className="p-2">
            <X size={24} />
          </button>
          <h2 className="font-serif text-xl">Scan Label</h2>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Camera/Upload View */}
      <div className="relative w-full h-full">
        {!capturedImage && mode === 'camera' && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {capturedImage && (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <img
              src={capturedImage}
              alt="Captured"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}

        {/* Processing Overlay */}
        <AnimatePresence>
          {processing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-white p-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="mb-6"
              >
                <Sparkles size={48} className="text-wine" />
              </motion.div>
              
              <h3 className="text-2xl font-serif mb-2">Reading label...</h3>
              <p className="text-slate text-sm mb-6">{progressMessage}</p>
              
              {/* Progress Bar */}
              <div className="w-full max-w-xs h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-wine"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <p className="text-sm text-slate mt-2">{Math.round(progress)}%</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Result */}
        {!processing && extractedInfo && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-32 left-0 right-0 p-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle size={24} className="text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-slate mb-2 font-semibold">Label Scanned!</p>
                  {extractedInfo.name && (
                    <p className="font-serif font-bold text-charcoal text-lg">{extractedInfo.name}</p>
                  )}
                  {extractedInfo.producer && (
                    <p className="text-sm text-slate mt-1">{extractedInfo.producer}</p>
                  )}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {extractedInfo.vintage && (
                      <span className="text-xs bg-stone px-3 py-1 rounded-full">{extractedInfo.vintage}</span>
                    )}
                    {extractedInfo.type && (
                      <span className="text-xs bg-stone px-3 py-1 rounded-full">{extractedInfo.type}</span>
                    )}
                    {extractedInfo.region && (
                      <span className="text-xs bg-stone px-3 py-1 rounded-full">{extractedInfo.region}</span>
                    )}
                    {extractedInfo.abv && (
                      <span className="text-xs bg-stone px-3 py-1 rounded-full">{extractedInfo.abv}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && !processing && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-32 left-0 right-0 p-6"
          >
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-xl">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900 mb-1">Could not read label</p>
                  <p className="text-xs text-red-700">{error}</p>
                  <p className="text-xs text-red-600 mt-2">Try better lighting or enter details manually</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8 pb-12">
        {!capturedImage && !processing && (
          <div className="flex justify-center items-center gap-6">
            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <Upload size={24} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Capture Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={capturePhoto}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 border-4 border-charcoal rounded-full" />
            </motion.button>

            {/* Camera/Upload Toggle */}
            <button
              onClick={() => setMode(mode === 'camera' ? 'upload' : 'camera')}
              className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <Camera size={24} />
            </button>
          </div>
        )}

        {capturedImage && !processing && (
          <div className="flex gap-4">
            <button
              onClick={handleRetake}
              className="flex-1 bg-white/20 text-white py-4 rounded-full font-semibold hover:bg-white/30 transition-colors"
            >
              Retake
            </button>
            <button
              onClick={handleUseImage}
              className="flex-1 bg-wine text-white py-4 rounded-full font-semibold hover:bg-wine/90 transition-colors"
            >
              {extractedInfo ? '✓ Use Info' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}