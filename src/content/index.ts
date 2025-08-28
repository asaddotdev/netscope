// Content script for NetScope
console.log("NetScope content script loaded");

// Inject any required scripts or communicate with the background worker
chrome.runtime.sendMessage({ type: "CONTENT_SCRIPT_LOADED" });
