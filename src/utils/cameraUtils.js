// Check if device has camera
export const hasCamera = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };
  
  // Request camera permission and get stream
  export const getCameraStream = async (facingMode = 'environment') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode, // 'environment' = back camera, 'user' = front
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      return stream;
    } catch (error) {
      console.error('Camera access error:', error);
      throw error;
    }
  };
  
  // Capture image from video stream
  export const captureImage = (videoElement, quality = 0.9) => {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0);
    
    return canvas.toDataURL('image/jpeg', quality);
  };
  
  // Stop camera stream
  export const stopCameraStream = (stream) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };
  
  // Compress image for storage
  export const compressImage = (dataUrl, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
  
        // Resize if needed
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
  
        canvas.width = width;
        canvas.height = height;
  
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
  
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = dataUrl;
    });
  };
  
  // File input helper for devices that don't support camera API
  export const selectImageFromFile = () => {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Hint to open camera on mobile
  
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }
  
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      };
  
      input.click();
    });
  };