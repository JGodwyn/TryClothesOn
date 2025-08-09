// API Service for Virtual Try-On
class VirtualTryOnAPI {
  constructor() {
    // Use configuration from config.js
    this.API_KEY = CONFIG.API.REPLICATE.API_KEY;
    this.BASE_URL = CONFIG.API.REPLICATE.BASE_URL;
    this.MODEL_VERSION = CONFIG.API.REPLICATE.MODEL_VERSION;

    // Validate API key
    if (!this.API_KEY || this.API_KEY === 'YOUR_REPLICATE_API_KEY_HERE') {
      console.warn('⚠️ Please set your Replicate API key in config.js');
    }
  }

  // Convert image to base64
  async imageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Remove the data:image/jpeg;base64, prefix
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Process virtual try-on
  async processVirtualTryOn(userImageFile, clothingImageFile) {
    try {
      console.log('Starting virtual try-on processing...');

      // Convert images to base64
      const userImageBase64 = await this.imageToBase64(userImageFile);
      const clothingImageBase64 = await this.imageToBase64(clothingImageFile);

      // Prepare the request payload
      const payload = {
        version: this.MODEL_VERSION,
        input: {
          image: `data:image/jpeg;base64,${userImageBase64}`,
          garment_image: `data:image/jpeg;base64,${clothingImageBase64}`,
          mask_type: 'normal',
          preserve_mask: false,
          background_enhance: true,
          face_restore: true,
          face_upsample: true,
          upscale: 1,
          codeformer_fidelity: 0.7,
        },
      };

      // Make API request
      const response = await fetch(`${this.BASE_URL}/predictions`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`,
        );
      }

      const result = await response.json();
      console.log('Prediction started:', result);

      // Poll for completion
      return await this.pollForCompletion(result.id);
    } catch (error) {
      console.error('Error processing virtual try-on:', error);
      throw error;
    }
  }

  // Poll for prediction completion
  async pollForCompletion(predictionId) {
    const maxAttempts = CONFIG.API.PROCESSING.MAX_ATTEMPTS;
    const pollInterval = CONFIG.API.PROCESSING.POLL_INTERVAL;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(
          `${this.BASE_URL}/predictions/${predictionId}`,
          {
            headers: {
              Authorization: `Token ${this.API_KEY}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Polling request failed: ${response.status}`);
        }

        const result = await response.json();
        console.log('Polling result:', result.status);

        if (result.status === 'succeeded') {
          return result.output;
        } else if (result.status === 'failed') {
          throw new Error(
            'Prediction failed: ' + (result.error || 'Unknown error'),
          );
        }

        // Wait before next poll
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        attempts++;
      } catch (error) {
        console.error('Error polling for completion:', error);
        throw error;
      }
    }

    throw new Error(
      `Prediction timed out after ${
        (maxAttempts * pollInterval) / 1000
      } seconds`,
    );
  }

  // Alternative: Use a simpler model for testing
  async processWithSimpleModel(userImageFile, clothingImageFile) {
    // This is a fallback method using a different model
    // You can implement this with a simpler virtual try-on model
    console.log('Using simple model for processing...');

    // For now, return a placeholder
    throw new Error(
      'Simple model not implemented yet. Please use the main processing method.',
    );
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VirtualTryOnAPI;
} else {
  // For browser/extension environment
  window.VirtualTryOnAPI = VirtualTryOnAPI;
}
