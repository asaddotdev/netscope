// Create NetScope panel in DevTools
chrome.devtools.panels.create(
  "NetScope",
  "icons/icon48.png", // Path relative to extension root
  "src/devtools/panel.html",
  (panel) => {
    // Panel is ready
    panel.onShown.addListener(() => {
      console.log("NetScope panel shown");
    });
    panel.onHidden.addListener(() => {
      console.log("NetScope panel hidden");
    });
  }
);
