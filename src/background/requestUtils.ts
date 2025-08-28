import type { RequestCategory, NetworkRequest } from "../types/network";

export function categorizeRequest(
  request: chrome.webRequest.WebRequestDetails
): RequestCategory {
  const url = new URL(request.url);
  const type = request.type;

  // Common analytics domains
  const analyticsPatterns = [
    "google-analytics.com",
    "analytics",
    "track",
    "pixel",
    "tag",
  ];

  // Common ad networks
  const adPatterns = ["doubleclick.net", "ad.com", "ads.", "advertis"];

  // Content types
  if (["image", "media", "font"].includes(type)) {
    return "content";
  }

  // Check for analytics
  if (analyticsPatterns.some((pattern) => url.hostname.includes(pattern))) {
    return "analytics";
  }

  // Check for ads
  if (adPatterns.some((pattern) => url.hostname.includes(pattern))) {
    return "ads";
  }

  // Security related
  if (
    ["csp_report", "ping"].includes(type) ||
    url.protocol === "chrome-extension:"
  ) {
    return "security";
  }

  // Functional (APIs, CDNs)
  if (["xmlhttprequest", "websocket"].includes(type)) {
    return "functional";
  }

  return "unknown";
}

export function createNetworkRequest(
  details: chrome.webRequest.WebRequestDetails
): NetworkRequest {
  return {
    id: `${details.requestId}`,
    url: details.url,
    method: details.method,
    type: details.type as chrome.webRequest.ResourceType,
    category: categorizeRequest(details),
    timestamp: details.timeStamp,
    tabId: details.tabId,
    size: 0, // Will be updated when response headers are received
    initiator: details.initiator,
  };
}
