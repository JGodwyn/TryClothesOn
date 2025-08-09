// Configuration for Virtual Try-On Extension
const CONFIG = {
  // API Configuration
  API: {
    // Replicate.ai configuration
    REPLICATE: {
      BASE_URL: 'https://api.replicate.com/v1',
      // You need to get your API key from https://replicate.com/account/api-tokens
      API_KEY: 'YOUR_REPLICATE_API_KEY_HERE',
      // VITON-HD model for virtual try-on
      MODEL_VERSION:
        'c445d2883cfa36b8c5d5c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0',
      // Alternative models you can try:
      // HR-VITON: 'c445d2883cfa36b8c5d5c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0'
      // ACGPN: 'c445d2883cfa36b8c5d5c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0'
    },

    // Processing settings
    PROCESSING: {
      TIMEOUT: 300000, // 5 minutes in milliseconds
      POLL_INTERVAL: 5000, // 5 seconds between polling attempts
      MAX_ATTEMPTS: 60, // Maximum number of polling attempts
    },
  },

  // UI Configuration
  UI: {
    LOADING: {
      MIN_PROGRESS_TIME: 2000, // Minimum time to show loading (ms)
      PROGRESS_UPDATE_INTERVAL: 2000, // How often to update progress bar (ms)
      MAX_PROGRESS: 90, // Maximum progress percentage before completion
    },
  },

  // Image Processing Configuration
  IMAGE: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB max file size
    SUPPORTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    RECOMMENDED_DIMENSIONS: {
      MIN_WIDTH: 256,
      MIN_HEIGHT: 256,
      MAX_WIDTH: 1024,
      MAX_HEIGHT: 1024,
    },
  },
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  // For browser/extension environment
  window.CONFIG = CONFIG;
}
