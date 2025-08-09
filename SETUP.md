# Virtual Try-On Extension Setup Guide

## Overview

This Chrome extension allows users to upload their photo and a clothing item, then uses AI to create a virtual try-on effect showing them wearing the clothing.

## Prerequisites

- A Replicate.ai account (free tier available)
- Chrome browser
- Basic understanding of Chrome extensions

## Step 1: Get Your Replicate API Key

1. Go to [Replicate.ai](https://replicate.com) and create an account
2. Navigate to your [API tokens page](https://replicate.com/account/api-tokens)
3. Click "Create API token"
4. Give it a name (e.g., "Virtual Try-On Extension")
5. Copy the generated API key

## Step 2: Configure the Extension

1. Open `config.js` in your extension directory
2. Replace `YOUR_REPLICATE_API_KEY_HERE` with your actual API key:

```javascript
API_KEY: 'r8_your_actual_api_key_here',
```

## Step 3: Load the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select your extension directory (`TryClothesOn`)
5. The extension should now appear in your extensions list

## Step 4: Test the Extension

1. Click the extension icon in your Chrome toolbar
2. Upload your photo (left card)
3. Upload a clothing item (right card)
4. Click "Try clothe on"
5. Wait for processing (may take 1-2 minutes)
6. View and download your result

## API Models Available

The extension is configured to use VITON-HD, but you can switch to other models by updating the `MODEL_VERSION` in `config.js`:

- **VITON-HD**: Best for high-quality virtual try-on
- **HR-VITON**: High-resolution version
- **ACGPN**: Alternative model with different characteristics

## Troubleshooting

### "API configuration error"

- Make sure you've set your API key in `config.js`
- Verify the API key is correct and active

### "Processing took too long"

- Try with smaller images (under 1MB)
- Check your internet connection
- The free tier has rate limits

### "Unable to connect to AI service"

- Check your internet connection
- Verify the API key is valid
- Try again in a few minutes

## Cost Considerations

- Replicate.ai offers a free tier with limited usage
- Each virtual try-on request costs approximately $0.01-0.05
- Monitor your usage at [replicate.com/account](https://replicate.com/account)

## Security Notes

- Never commit your API key to version control
- Consider using environment variables for production
- The API key is stored locally in the extension

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your API key is correct
3. Ensure you have sufficient credits in your Replicate account
4. Try with different images to rule out image-specific issues

## Next Steps

Once basic functionality is working, consider:

- Adding image preprocessing for better results
- Implementing caching to reduce API calls
- Adding support for different clothing types
- Creating a backend service for better control

