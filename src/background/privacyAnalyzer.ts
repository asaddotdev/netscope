import type { NetworkRequest } from "../types/network";
import type { DomainInfo } from "../types/privacy";
import { TRACKER_DATABASE } from "../types/privacy";

export class PrivacyAnalyzer {
  private domainCache: Map<string, DomainInfo> = new Map();

  analyzeRequest(request: NetworkRequest): void {
    const url = new URL(request.url);
    const domain = url.hostname;

    const domainInfo =
      this.domainCache.get(domain) || this.createDomainInfo(domain);

    // Update basic metrics
    domainInfo.requestCount++;
    domainInfo.totalSize += request.size;

    // Update privacy metrics based on the request
    this.updatePrivacyMetrics(domainInfo, request);

    // Calculate privacy risk score
    this.calculatePrivacyRisk(domainInfo);

    this.domainCache.set(domain, domainInfo);
  }

  private createDomainInfo(domain: string): DomainInfo {
    return {
      domain,
      category: this.categorizeTracker(domain),
      privacyRisk: {
        score: 0,
        severity: "low",
        reasons: [],
      },
      metrics: {
        cookies: { total: 0, thirdParty: 0, tracking: 0 },
        fingerprinting: { detected: false, methods: [] },
        dataSharing: {
          knownTrackers: [],
          thirdPartyDomains: [],
          geoLocations: new Set(),
        },
      },
      requestCount: 0,
      totalSize: 0,
    };
  }

  private categorizeTracker(domain: string): string {
    for (const [category, domains] of Object.entries(TRACKER_DATABASE)) {
      if (domains.some((d) => domain.includes(d))) {
        return category;
      }
    }
    return "unknown";
  }

  private updatePrivacyMetrics(
    domainInfo: DomainInfo,
    request: NetworkRequest
  ): void {
    const metrics = domainInfo.metrics;

    // Check for cookies
    try {
      if (request.initiator && request.initiator !== "null") {
        // Handle chrome-extension:// URLs and other special cases
        if (!request.initiator.startsWith("chrome-extension://")) {
          const initiatorUrl = new URL(request.initiator);
          if (
            initiatorUrl.hostname &&
            initiatorUrl.hostname !== domainInfo.domain
          ) {
            metrics.cookies.thirdParty++;
            if (
              !metrics.dataSharing.thirdPartyDomains.includes(
                initiatorUrl.hostname
              )
            ) {
              metrics.dataSharing.thirdPartyDomains.push(initiatorUrl.hostname);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error parsing initiator URL:", error);
      console.debug("Invalid initiator URL:", request.initiator);
    }

    // Check for known trackers
    if (this.isKnownTracker(domainInfo.domain)) {
      metrics.dataSharing.knownTrackers.push(domainInfo.domain);
    }

    // Check for fingerprinting methods
    if (request.url.includes("canvas") || request.url.includes("webgl")) {
      metrics.fingerprinting.detected = true;
      metrics.fingerprinting.methods.push("canvas/webgl");
    }
  }

  private calculatePrivacyRisk(domainInfo: DomainInfo): void {
    let score = 0;
    const reasons: string[] = [];

    // Known tracker penalty
    if (domainInfo.metrics.dataSharing.knownTrackers.length > 0) {
      score += 30;
      reasons.push("Known tracking domain");
    }

    // Third-party cookie penalty
    if (domainInfo.metrics.cookies.thirdParty > 0) {
      score += 20;
      reasons.push("Uses third-party cookies");
    }

    // Fingerprinting penalty
    if (domainInfo.metrics.fingerprinting.detected) {
      score += 25;
      reasons.push("Browser fingerprinting detected");
    }

    // High request volume penalty
    if (domainInfo.requestCount > 10) {
      score += 15;
      reasons.push("High volume of requests");
    }

    domainInfo.privacyRisk = {
      score: Math.min(score, 100),
      severity: score > 70 ? "high" : score > 40 ? "medium" : "low",
      reasons,
    };
  }

  private isKnownTracker(domain: string): boolean {
    return Object.values(TRACKER_DATABASE).some((domains) =>
      domains.some((d) => domain.includes(d))
    );
  }

  getDomainStats(): DomainInfo[] {
    return Array.from(this.domainCache.values());
  }

  clear(): void {
    this.domainCache.clear();
  }
}
