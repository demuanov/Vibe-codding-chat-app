// Chat widget shared utilities

/**
 * Format time for message timestamps
 * @param {Date} date - The date to format
 * @returns {string} Formatted time string (HH:MM)
 */
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Detect if keyboard is open on mobile devices
 * @returns {boolean} True if keyboard is likely open
 */
function isKeyboardOpen() {
  const windowHeight = window.innerHeight;
  const threshold = window.screen.height * 0.75;
  return windowHeight < threshold;
}

/**
 * Send a message to parent window
 * @param {string} type - Message type
 * @param {Object} data - Message data
 */
function sendMessageToParent(type, data = {}) {
  window.parent.postMessage({
    type,
    ...data
  }, '*');
}

/**
 * Handle URL parameters
 * @returns {URLSearchParams} URL search params object
 */
function getUrlParams() {
  return new URLSearchParams(window.location.search);
}

/**
 * Update URL without page reload
 * @param {string} key - Parameter key
 * @param {string} value - Parameter value
 */
function updateUrlParam(key, value) {
  const newUrl = new URL(window.location);
  newUrl.searchParams.set(key, value);
  window.history.replaceState({}, '', newUrl);
}

// Export utilities for ES modules
if (typeof exports !== 'undefined') {
  exports.formatTime = formatTime;
  exports.isKeyboardOpen = isKeyboardOpen;
  exports.sendMessageToParent = sendMessageToParent;
  exports.getUrlParams = getUrlParams;
  exports.updateUrlParam = updateUrlParam;
}

// Make utilities available globally for non-module scripts
window.ChatUtils = {
  formatTime,
  isKeyboardOpen,
  sendMessageToParent,
  getUrlParams,
  updateUrlParam
};