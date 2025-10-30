import { useState, useRef, useEffect } from 'react';
import { extractTextFromImage } from '../../services/visionService';

export default function ScanScreen({ isOpen, onClose, onCapture, category }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [mode, setMode] = useState('select'); // 'select', 'camera', 'preview'
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Cleanup camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  if (!isOpen) return null;

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setMode('camera');
    } catch (error) {
      console.error('Camera error:', error);
      alert('Could not access camera. Please use the upload option instead.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const processImage = async (photo) => {
    try {
      setIsProcessing(true);
      setProgress(0);
      
      const result = await extractTextFromImage(
        photo, 
        (percent, message) => {
          setProgress(percent);
          setProgressMessage(message);
        },
        category
      );

      if (result.success) {
        if (result.enriched) {
          console.log('✨ Database match found!', result.extracted);
        }
        
        stopCamera();
        onCapture({
          photo: photo,
          extracted: result.extracted
        });
      } else {
        alert('Failed to extract text: ' + result.error);
        setIsProcessing(false);
        setPreviewImage(null);
      }
    } catch (error) {
      console.error('Scan error:', error);
      alert('Error scanning label');
      setIsProcessing(false);
      setPreviewImage(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    
    const photo = canvas.toDataURL('image/jpeg');
    setPreviewImage(photo);
    setMode('preview');
    stopCamera();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
      setMode('preview');
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (previewImage) {
      processImage(previewImage);
    }
  };

  const handleRetake = () => {
    setPreviewImage(null);
    setMode('select');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="scan-screen-modal">
      <div className="scan-screen-overlay" onClick={handleCancel} />
      
      <div className="scan-screen-content">
        {/* Selection Screen */}
        {mode === 'select' && (
          <>
            <div className="selection-screen">
              <h2>Scan Wine Label</h2>
              <p>Choose how you want to capture your wine</p>
              
              <div className="selection-buttons">
                <button 
                  className="selection-button"
                  onClick={startCamera}
                >
                  <div className="button-icon">📷</div>
                  <div className="button-text">
                    <div className="button-title">Take Photo</div>
                    <div className="button-subtitle">Use your camera</div>
                  </div>
                </button>

                <button 
                  className="selection-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="button-icon">📁</div>
                  <div className="button-text">
                    <div className="button-title">Upload Photo</div>
                    <div className="button-subtitle">Choose from gallery</div>
                  </div>
                </button>
              </div>

              <button onClick={handleCancel} className="skip-button">
                Skip for now
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </>
        )}

        {/* Camera Screen */}
        {mode === 'camera' && (
          <>
            <div className="camera-view">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="video-element"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            <div className="camera-controls">
              <button 
                onClick={() => {
                  stopCamera();
                  setMode('select');
                }} 
                className="btn-secondary"
              >
                ← Back
              </button>
              <button 
                onClick={capturePhoto} 
                className="btn-primary capture-btn"
              >
                📷 Capture
              </button>
            </div>
          </>
        )}

        {/* Preview Screen */}
        {mode === 'preview' && (
          <>
            <div className="preview-view">
              <img src={previewImage} alt="Preview" className="preview-image" />
              
              {isProcessing && (
                <div className="processing-overlay">
                  <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="progress-message">{progressMessage}</p>
                </div>
              )}
            </div>

            <div className="preview-controls">
              <button 
                onClick={handleRetake} 
                className="btn-secondary"
                disabled={isProcessing}
              >
                ↺ Retake
              </button>
              <button 
                onClick={handleConfirm} 
                className="btn-primary"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : '✓ Use This Photo'}
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .scan-screen-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scan-screen-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
        }

        .scan-screen-content {
          position: relative;
          z-index: 1001;
          width: 90%;
          max-width: 500px;
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .selection-screen {
          padding: 3rem 2rem;
          text-align: center;
        }

        .selection-screen h2 {
          margin: 0 0 0.5rem 0;
          font-size: 1.75rem;
          font-weight: 600;
        }

        .selection-screen p {
          margin: 0 0 2rem 0;
          color: #666;
          font-size: 1rem;
        }

        .selection-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .selection-button {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .selection-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .button-icon {
          font-size: 2.5rem;
        }

        .button-text {
          flex: 1;
        }

        .button-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .button-subtitle {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .skip-button {
          background: none;
          border: none;
          color: #666;
          font-size: 1rem;
          cursor: pointer;
          padding: 0.75rem;
        }

        .skip-button:hover {
          color: #333;
          text-decoration: underline;
        }

        .camera-view,
        .preview-view {
          width: 100%;
          height: 60vh;
          max-height: 600px;
          background: black;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .processing-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .progress-container {
          width: 80%;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s ease;
        }

        .progress-message {
          color: white;
          font-size: 0.875rem;
          margin: 0;
        }

        .camera-controls,
        .preview-controls {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          background: white;
        }

        .btn-secondary,
        .btn-primary {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary {
          background: #e0e0e0;
          color: #333;
          flex: 1;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #d0d0d0;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          flex: 2;
        }

        .capture-btn {
          flex: 3;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .scan-screen-content {
            width: 100%;
            height: 100%;
            max-width: none;
            border-radius: 0;
          }

          .camera-view,
          .preview-view {
            height: calc(100vh - 100px);
            max-height: none;
          }
        }
      `}</style>
    </div>
  );
}