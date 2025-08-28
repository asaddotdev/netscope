import { createNetworkRequest } from "./requestUtils";
import { requestStore } from "./requestStore";
import { PrivacyAnalyzer } from "./privacyAnalyzer";

const privacyAnalyzer = new PrivacyAnalyzer();

// Handle network requests
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const request = createNetworkRequest(
      details as chrome.webRequest.WebRequestDetails
    );
    requestStore.addRequest(request);
    privacyAnalyzer.analyzeRequest(request);
    return {}; // Required for blocking listener
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
);

// Update request size from response headers
chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    const contentLength = details.responseHeaders?.find(
      (h) => h.name.toLowerCase() === "content-length"
    );
    if (contentLength?.value) {
      const size = parseInt(contentLength.value, 10);
      requestStore.updateRequestDetails(details.requestId, { size });
      const headers: Record<string, string> = {};
      details.responseHeaders?.forEach((h) => {
        if (h.name && h.value) {
          headers[h.name.toLowerCase()] = h.value;
        }
      });
      requestStore.updateRequestDetails(details.requestId, {
        headers,
      });
      // Re-analyze with updated size
      const request = requestStore
        .getRequests()
        .find((r) => r.id === details.requestId);
      if (request) {
        request.size = size;
        privacyAnalyzer.analyzeRequest(request);
      }
    }
    return {}; // Required for blocking listener
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

chrome.webRequest.onCompleted.addListener(
  (details) => {
    requestStore.updateRequestDetails(details.requestId, {
      timestamp: details.timeStamp,
      statusCode: details.statusCode,
      isCompleted: true,
    });
  },
  { urls: ["<all_urls>"] },
  ["extraHeaders"]
);

// Listen for messages from content script and DevTools panel
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_REQUESTS") {
    sendResponse({ requests: requestStore.getRequests() });
  } else if (message.type === "GET_STATS") {
    sendResponse({ stats: requestStore.getStats() });
  } else if (message.type === "GET_PRIVACY_STATS") {
    sendResponse({ privacyStats: privacyAnalyzer.getDomainStats() });
  } else if (message.type === "CLEAR_DATA") {
    requestStore.clear();
    privacyAnalyzer.clear();
    sendResponse({ success: true });
  }
  return true; // Required for async response
});
