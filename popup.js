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
                { onboardingShown: true },
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

// Add keyboard interaction support for upload cards
function addUploadCardInteractions() {
  const uploadCards = document.querySelectorAll('.upload-card');
  uploadCards.forEach((card) => {
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Simulate file upload trigger
        console.log('Upload triggered for:', card.getAttribute('aria-label'));
        // Here you would typically trigger a file input dialog
      }
    });
    card.addEventListener('click', function () {
      console.log('Upload clicked for:', card.getAttribute('aria-label'));
      // Here you would typically trigger a file input dialog
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['onboardingShown'], function (result) {
      if (!result.onboardingShown) {
        showOnboarding();
        chrome.storage.local.set({ onboardingShown: true });
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
