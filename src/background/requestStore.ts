import type { ExtendedNetworkRequest } from "@/devtools/DevToolsPanel";
import type { RequestStats } from "../types/network";

class RequestStore {
  private requests: Map<string, ExtendedNetworkRequest> = new Map();

  // popup
  private stats: RequestStats = {
    totalRequests: 0,
    byCategory: {
      content: 0,
      analytics: 0,
      ads: 0,
      functional: 0,
      security: 0,
      unknown: 0,
    },
    totalSize: 0,
    domains: new Set(),
  };

  addRequest(request: ExtendedNetworkRequest): void {
    this.requests.set(request.id, request);
    this.stats.totalRequests++;
    this.stats.byCategory[request.category]++;
    this.stats.domains.add(new URL(request.url).hostname);
  }

  updateRequestDetails(
    requestId: string,
    updates: Partial<ExtendedNetworkRequest>
  ): void {
    const request = this.requests.get(requestId) as ExtendedNetworkRequest;
    if (request) {
      Object.assign(request, updates);
    }
  }

  getStats(): RequestStats {
    return { ...this.stats, domains: new Set(this.stats.domains) };
  }

  getRequests(): ExtendedNetworkRequest[] {
    return Array.from(this.requests.values());
  }

  clear(): void {
    this.requests.clear();
    this.stats = {
      totalRequests: 0,
      byCategory: {
        content: 0,
        analytics: 0,
        ads: 0,
        functional: 0,
        security: 0,
        unknown: 0,
      },
      totalSize: 0,
      domains: new Set(),
    };
  }
}

export const requestStore = new RequestStore();
