export type RequestCategory =
  | "content" // images, videos, fonts
  | "analytics" // tracking
  | "ads" // advertising
  | "functional" // APIs, CDNs
  | "security" // certs, OCSP
  | "unknown"; // uncategorized

export interface NetworkRequest {
  id: string;
  url: string;
  method: string;
  type: chrome.webRequest.ResourceType;
  category: RequestCategory;
  timestamp: number;
  tabId: number;
  size: number;
  statusCode?: number;
  initiator?: string;
}

export interface RequestStats {
  totalRequests: number;
  byCategory: Record<RequestCategory, number>;
  totalSize: number;
  domains: Set<string>;
}
