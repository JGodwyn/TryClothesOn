console.log('Try Clothes On extension popup loaded.');
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
      // TODO: Add your image processing logic here
      alert('Processing your images for virtual try-on!');
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
