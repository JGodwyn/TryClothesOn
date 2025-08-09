console.log('Try Clothes On extension popup loaded.');

// Initialize API service
const virtualTryOnAPI = new VirtualTryOnAPI();

// Global variables for tracking uploaded files
let userImageFile = null;
let clothingImageFile = null;
// Onboarding logic
function addBouncyEffectToButtons() {
  document.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      btn.classList.remove('bouncy');
      // Force reflow to restart animation
      void btn.offsetWidth;
      btn.classList.add('bouncy');
    });
  });
}

function showOnboarding() {
  const content = document.getElementById('content');
  fetch('onboarding.html')
    .then((response) => response.text())
    .then((html) => {
      content.innerHTML = html;
      setTimeout(() => {
        const nextBtn = document.querySelector('.next-button');
        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            if (
              typeof chrome !== 'undefined' &&
              chrome.storage &&
              chrome.storage.local
            ) {
              chrome.storage.local.set(
                {
                  onboardingShown: true,
                },
                showMainContent,
              );
            } else {
              showMainContent();
            }
          });
        }
        addBouncyEffectToButtons();
      }, 0);
    });
}

function showMainContent() {
  const content = document.getElementById('content');
  fetch('main.html')
    .then((response) => response.text())
    .then((html) => {
      content.innerHTML = html;
      setTimeout(() => {
        addUploadCardInteractions();
        addBouncyEffectToButtons();
      }, 0);
    });
}

// Add file upload functionality for upload cards
function addUploadCardInteractions() {
  const leftCard = document.querySelector('.upload-card-left');
  const rightCard = document.querySelector('.upload-card-right');

  if (!leftCard || !rightCard) return;

  // Track uploaded images
  let leftImageUploaded = false;
  let rightImageUploaded = false;

  // Create hidden file input elements
  const leftFileInput = document.createElement('input');
  leftFileInput.type = 'file';
  leftFileInput.accept = 'image/*';
  leftFileInput.style.display = 'none';

  const rightFileInput = document.createElement('input');
  rightFileInput.type = 'file';
  rightFileInput.accept = 'image/*';
  rightFileInput.style.display = 'none';

  // Add file inputs to the document
  document.body.appendChild(leftFileInput);
  document.body.appendChild(rightFileInput);

  // Function to check if both images are uploaded and show/hide button
  function checkBothImagesUploaded() {
    const actionButtonContainer = document.querySelector(
      '.action-button-container',
    );
    if (actionButtonContainer) {
      if (leftImageUploaded && rightImageUploaded) {
        actionButtonContainer.style.display = 'flex';
      } else {
        actionButtonContainer.style.display = 'none';
      }
    }
  }

  // Function to handle file selection
  function handleFileSelect(fileInput, card, isLeftCard) {
    fileInput.addEventListener('change', function (event) {
      const file = event.target.files[0];
      if (file) {
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
          alert('Please select an image file.');
          return;
        }

        // Store the file for API processing
        if (isLeftCard) {
          userImageFile = file;
        } else {
          clothingImageFile = file;
        }

        // Create a FileReader to read the image
        const reader = new FileReader();
        reader.onload = function (e) {
          // Create image element
          const img = document.createElement('img');
          img.src = e.target.result;

          // Clear the card content and add the image
          card.innerHTML = '';
          card.appendChild(img);

          // Add a small overlay with a change button
          const overlay = document.createElement('div');
          overlay.className = 'change-overlay';
          overlay.textContent = 'Change';
          overlay.addEventListener('click', function (e) {
            e.stopPropagation();
            fileInput.click();
          });

          card.appendChild(overlay);

          // Add white border to indicate image is uploaded
          card.classList.add('has-image');

          // Mark this image as uploaded
          if (isLeftCard) {
            leftImageUploaded = true;
          } else {
            rightImageUploaded = true;
          }

          // Check if both images are uploaded
          checkBothImagesUploaded();
        };
        reader.readAsDataURL(file);
      }
      // Note: We don't handle the else case (no file selected) because
      // that means the user cancelled the file picker, so we keep the existing image
    });
  }

  // Add click event listeners to the cards
  leftCard.addEventListener('click', function (e) {
    // Don't trigger if clicking on the change overlay
    if (!e.target.classList.contains('change-overlay')) {
      leftFileInput.click();
    }
  });

  rightCard.addEventListener('click', function (e) {
    // Don't trigger if clicking on the change overlay
    if (!e.target.classList.contains('change-overlay')) {
      rightFileInput.click();
    }
  });

  // Handle file selection for both cards
  handleFileSelect(leftFileInput, leftCard, true);
  handleFileSelect(rightFileInput, rightCard, false);

  // Add click handler for the action button
  const actionButton = document.querySelector('.action-button');
  if (actionButton) {
    actionButton.addEventListener('click', function () {
      // Add bouncy effect
      actionButton.classList.remove('bouncy');
      void actionButton.offsetWidth;
      actionButton.classList.add('bouncy');

      // Handle the action when both images are uploaded
      console.log('Processing images for virtual try-on...');
      processVirtualTryOn();
    });
  }

  // Add keyboard support for accessibility
  leftCard.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      leftFileInput.click();
    }
  });

  rightCard.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      rightFileInput.click();
    }
  });
}

// Virtual Try-On Processing Functions
function showLoadingScreen() {
  const loadingHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">Processing your virtual try-on...</div>
      <div class="loading-subtext">This may take up to 2 minutes. Please don't close the extension.</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 0%"></div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', loadingHTML);

  // Animate progress bar
  const progressFill = document.querySelector('.progress-fill');
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 90) progress = 90; // Don't go to 100% until actually complete
    progressFill.style.width = progress + '%';
  }, 2000);

  return progressInterval;
}

function hideLoadingScreen() {
  const loadingContainer = document.querySelector('.loading-container');
  if (loadingContainer) {
    loadingContainer.remove();
  }
}

function showResultScreen(resultImageUrl) {
  const resultHTML = `
    <div class="result-container">
      <div class="result-header">
        <div class="result-title">Virtual Try-On Complete!</div>
        <button class="close-button" onclick="closeResultScreen()">&times;</button>
      </div>
      <div class="result-image-container">
        <img src="${resultImageUrl}" alt="Virtual try-on result" class="result-image">
        <div class="result-actions">
          <button class="result-button download-button" onclick="downloadResult('${resultImageUrl}')">
            Download Image
          </button>
          <button class="result-button try-again-button" onclick="closeResultScreen()">
            Try Another Item
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', resultHTML);
}

function showErrorScreen(errorMessage) {
  const errorHTML = `
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <div class="error-title">Processing Failed</div>
      <div class="error-message">${errorMessage}</div>
      <button class="retry-button" onclick="closeErrorScreen()">Try Again</button>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', errorHTML);
}

function closeResultScreen() {
  const resultContainer = document.querySelector('.result-container');
  if (resultContainer) {
    resultContainer.remove();
  }
}

function closeErrorScreen() {
  const errorContainer = document.querySelector('.error-container');
  if (errorContainer) {
    errorContainer.remove();
  }
}

function downloadResult(imageUrl) {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = 'virtual-tryon-result.jpg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function processVirtualTryOn() {
  try {
    // Validate that we have both images
    if (!userImageFile || !clothingImageFile) {
      throw new Error('Please upload both your image and a clothing item.');
    }

    // Show loading screen
    const progressInterval = showLoadingScreen();

    // Process the virtual try-on
    const result = await virtualTryOnAPI.processVirtualTryOn(
      userImageFile,
      clothingImageFile,
    );

    // Clear progress interval
    clearInterval(progressInterval);

    // Hide loading screen
    hideLoadingScreen();

    // Show result
    if (result && result.length > 0) {
      showResultScreen(result[0]); // Assuming the API returns an array of image URLs
    } else {
      throw new Error('No result image received from the API.');
    }
  } catch (error) {
    console.error('Virtual try-on processing failed:', error);

    // Hide loading screen
    hideLoadingScreen();

    // Show error screen
    let errorMessage =
      'An unexpected error occurred while processing your images.';

    if (error.message.includes('API request failed')) {
      errorMessage =
        'Unable to connect to the AI service. Please check your internet connection and try again.';
    } else if (error.message.includes('API key')) {
      errorMessage = 'API configuration error. Please contact support.';
    } else if (error.message.includes('timeout')) {
      errorMessage =
        'Processing took too long. Please try again with smaller images.';
    } else if (error.message.includes('Please upload both')) {
      errorMessage = error.message;
    }

    showErrorScreen(errorMessage);
  }
}

// Make functions globally available for onclick handlers
window.closeResultScreen = closeResultScreen;
window.closeErrorScreen = closeErrorScreen;
window.downloadResult = downloadResult;

document.addEventListener('DOMContentLoaded', function () {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['onboardingShown'], function (result) {
      if (!result.onboardingShown) {
        showOnboarding();
        chrome.storage.local.set({
          onboardingShown: true,
        });
      } else {
        showMainContent();
      }
    });
  } else {
    // Fallback for non-extension environments
    showOnboarding();
  }
  addUploadCardInteractions();
});
