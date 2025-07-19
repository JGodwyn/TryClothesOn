console.log('Try Clothes On extension popup loaded.');
// Onboarding logic
function showOnboarding() {
  const content = document.getElementById('content');
  fetch('onboarding.html')
    .then((response) => response.text())
    .then((html) => {
      content.innerHTML = html;
      const nextBtn = document.getElementById('onboarding-next');
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
    });
}

function showMainContent() {
  const content = document.getElementById('content');
  content.innerHTML = 'Enter the content of your plugin here.';
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
});
