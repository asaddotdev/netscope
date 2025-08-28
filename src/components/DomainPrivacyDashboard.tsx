import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Cookie,
  Fingerprint,
  Share2,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { DomainInfo } from "@/types/privacy";

interface DomainPrivacyDashboardProps {
  domains: DomainInfo[];
}

export function DomainPrivacyDashboard({
  domains,
}: DomainPrivacyDashboardProps) {
  const [selectedDomain, setSelectedDomain] = useState<DomainInfo | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleRowClick = (domain: DomainInfo) => {
    setSelectedDomain(domain);
    setIsSheetOpen(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300";
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-4">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-balance">
          Domain Privacy Dashboard
        </h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              {/* <TableHead>Category</TableHead> */}
              <TableHead className="text-right">Requests</TableHead>
              <TableHead className="text-right">Total Size</TableHead>
              <TableHead className="text-center">Privacy Score</TableHead>
              <TableHead className="text-center">Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="max-h-[90dvh] overflow-auto">
            {domains.map((domain, index) => (
              <TableRow
                key={index}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleRowClick(domain)}
              >
                <TableCell>{domain.domain}</TableCell>
                {/* <TableCell>
                  <Badge variant="outline">{domain.category}</Badge>
                </TableCell> */}
                <TableCell className="text-right font-mono">
                  {domain.requestCount.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatSize(domain.totalSize)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono font-semibold">
                      {domain.privacyRisk.score}
                    </span>
                    <span className="text-muted-foreground">/100</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={getSeverityColor(domain.privacyRisk.severity)}
                  >
                    {domain.privacyRisk.severity}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl">
          {selectedDomain && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span className="text-xl font-bold">
                    {selectedDomain.domain}
                  </span>
                </SheetTitle>
                <SheetDescription>
                  Detailed privacy analysis and risk assessment
                </SheetDescription>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-120px)] mt-6 p-5">
                <div className="space-y-6">
                  {/* Privacy Risk Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Privacy Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Risk Score</span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">
                            {selectedDomain.privacyRisk.score}
                          </span>
                          <span className="text-muted-foreground">/100</span>
                          <Badge
                            className={getSeverityColor(
                              selectedDomain.privacyRisk.severity
                            )}
                          >
                            {selectedDomain.privacyRisk.severity}
                          </Badge>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Risk Factors
                        </h4>
                        <ul className="space-y-1">
                          {selectedDomain.privacyRisk.reasons.map(
                            (reason, index) => (
                              <li
                                key={index}
                                className="text-sm text-muted-foreground flex items-center gap-2"
                              >
                                <span className="text-destructive">⦿</span>
                                {reason}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cookies */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Cookie className="h-4 w-4" />
                        Cookies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {selectedDomain.metrics.cookies.total}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {selectedDomain.metrics.cookies.thirdParty}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Third-party
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {selectedDomain.metrics.cookies.tracking}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Tracking
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Fingerprinting */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Fingerprint className="h-4 w-4" />
                        Fingerprinting
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        {selectedDomain.metrics.fingerprinting.detected ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        <span className="font-medium">
                          {selectedDomain.metrics.fingerprinting.detected
                            ? "Detected"
                            : "Not Detected"}
                        </span>
                      </div>
                      {selectedDomain.metrics.fingerprinting.methods.length >
                        0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Methods Used
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedDomain.metrics.fingerprinting.methods.map(
                              (method, index) => (
                                <Badge key={index} variant="secondary">
                                  {method}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Data Sharing */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        Data Sharing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedDomain.metrics.dataSharing.knownTrackers.length >
                        0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Known Trackers
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedDomain.metrics.dataSharing.knownTrackers.map(
                              (tracker, index) => (
                                <Badge key={index} variant="destructive">
                                  {tracker}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {selectedDomain.metrics.dataSharing.thirdPartyDomains
                        .length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Third-party Domains
                          </h4>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {selectedDomain.metrics.dataSharing.thirdPartyDomains.map(
                              (domain, index) => (
                                <div
                                  key={index}
                                  className="text-sm text-muted-foreground font-mono"
                                >
                                  {domain}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {selectedDomain.metrics.dataSharing.geoLocations.size >
                        0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Geographic Locations
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {Array.from(
                              selectedDomain.metrics.dataSharing.geoLocations
                            ).map((location, index) => (
                              <Badge key={index} variant="outline">
                                {location}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
