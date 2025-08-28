export interface PrivacyRisk {
  score: number; // 0-100, higher means more risky
  severity: "low" | "medium" | "high";
  reasons: string[]; // Why this score was given
}

export interface PrivacyMetrics {
  cookies: {
    total: number;
    thirdParty: number;
    tracking: number;
  };
  fingerprinting: {
    detected: boolean;
    methods: string[]; // Canvas, WebGL, etc.
  };
  dataSharing: {
    knownTrackers: string[];
    thirdPartyDomains: string[];
    geoLocations: Set<string>;
  };
}

export interface DomainInfo {
  domain: string;
  category: string;
  privacyRisk: PrivacyRisk;
  metrics: PrivacyMetrics;
  requestCount: number;
  totalSize: number;
}

// Known tracker categories and their domains
export const TRACKER_DATABASE = {
  analytics: [
    "google-analytics.com",
    "analytics.google.com",
    "segment.io",
    "mixpanel.com",
    "heap.io",
    "amplitude.com",
    "hotjar.com",
    "statcounter.com",
    "piwik.pro",
    "matomo.org",
    "newrelic.com",
    "kissmetrics.com",
  ],
  advertising: [
    "doubleclick.net",
    "adnxs.com",
    "advertising.com",
    "googleadservices.com",
    "rubiconproject.com",
    "criteo.com",
    "taboola.com",
    "outbrain.com",
    "yieldmanager.com",
    "openx.net",
    "pubmatic.com",
    "quantserve.com",
    "zeta.com",
  ],
  social: [
    "facebook.com",
    "twitter.com",
    "linkedin.com",
    "instagram.com",
    "tiktok.com",
    "snapchat.com",
    "pinterest.com",
    "reddit.com",
    "vk.com",
    "weibo.com",
  ],
  fingerprinting: [
    "fingerprintjs.com",
    "mouseover.info",
    "deviceinfo.me",
    "browserleaks.com",
    "panopticlick.eff.org",
    "amiunique.org",
    "bluecava.com",
    "iproov.com",
    "threatmetrix.com",
    "iovation.com",
  ],
};
