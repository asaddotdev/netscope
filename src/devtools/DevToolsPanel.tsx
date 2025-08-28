/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Play,
  Search,
  Shield,
  Trash2,
  User,
  XCircle,
  Copy,
  Edit,
  RotateCcw,
  Save,
  Send,
  Pause,
  Zap,
  EyeOff,
  HelpCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { NetworkRequest, RequestCategory } from "../types/network";
import type { DomainInfo } from "@/types/privacy";
import { DomainPrivacyDashboard } from "@/components/DomainPrivacyDashboard";

// Helper functions
const getStatusIcon = (status: number, isCompleted: boolean = true) => {
  if (!isCompleted) return <Clock className="h-4 w-4 text-blue-500" />;
  if (status >= 200 && status < 300)
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  if (status >= 300 && status < 400)
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  if (status >= 400) return <XCircle className="h-4 w-4 text-red-500" />;
  if (status === 0) return <Clock className="h-4 w-4 text-gray-500" />;
  return <Clock className="h-4 w-4 text-gray-500" />;
};

const getStatusColor = (status: number, isCompleted: boolean = true) => {
  if (!isCompleted) return "text-blue-600";
  if (status >= 200 && status < 300) return "text-green-600";
  if (status >= 300 && status < 400) return "text-yellow-600";
  if (status >= 400) return "text-red-600";
  if (status === 0) return "text-gray-600";
  return "text-gray-600";
};

const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case "security":
    case "auth":
      return <Shield className="h-4 w-4" />;

    case "privacy":
    case "analytics":
      return <User className="h-4 w-4" />;

    case "ads":
      return <EyeOff className="h-4 w-4" />;

    case "functional":
      return <Zap className="h-4 w-4" />;

    case "content":
    case "image":
    case "script":
    case "stylesheet":
      return <Globe className="h-4 w-4" />;

    case "unknown":
    default:
      return <HelpCircle className="h-4 w-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case "security":
    case "auth":
      return "bg-red-100 text-red-800 border-red-200";

    case "privacy":
    case "analytics":
      return "bg-blue-100 text-blue-800 border-blue-200";

    case "ads":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";

    case "functional":
      return "bg-purple-100 text-purple-800 border-purple-200";

    case "content":
    case "image":
    case "script":
    case "stylesheet":
      return "bg-green-100 text-green-800 border-green-200";

    case "unknown":
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatSize = (size: number) => {
  if (size <= 0) return "0 B";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const formatTime = (time: number) => {
  if (time <= 0) return "0ms";
  if (time < 1000) return `${Math.round(time)}ms`;
  return `${(time / 1000).toFixed(2)}s`;
};

const categorizeRequest = (url: string, type: string): RequestCategory => {
  const urlLower = url.toLowerCase();
  const typeLower = type?.toLowerCase() || "";

  // Security/Auth related
  if (
    urlLower.includes("auth") ||
    urlLower.includes("login") ||
    urlLower.includes("oauth") ||
    urlLower.includes("token") ||
    urlLower.includes("security") ||
    urlLower.includes("cert") ||
    urlLower.includes("ocsp")
  ) {
    return "security";
  }

  // Analytics/Tracking related
  if (
    urlLower.includes("analytics") ||
    urlLower.includes("track") ||
    urlLower.includes("gtm") ||
    urlLower.includes("facebook") ||
    urlLower.includes("google-analytics") ||
    urlLower.includes("pixel")
  ) {
    return "analytics";
  }

  // Ads/Advertising related
  if (
    urlLower.includes("ads") ||
    urlLower.includes("doubleclick") ||
    urlLower.includes("adservice") ||
    urlLower.includes("adnxs") ||
    urlLower.includes("googlesyndication")
  ) {
    return "ads";
  }

  // Content types (static assets)
  if (
    typeLower.includes("image") ||
    typeLower.includes("script") ||
    typeLower.includes("stylesheet") ||
    typeLower.includes("font") ||
    typeLower.includes("media") ||
    urlLower.match(/\.(jpg|jpeg|png|gif|webp|svg|css|js|woff2?|ttf|mp4|webm)$/)
  ) {
    return "content";
  }

  // Functional (APIs, CDNs, general app requests)
  if (
    urlLower.includes("api") ||
    urlLower.includes("cdn") ||
    urlLower.includes("service") ||
    urlLower.includes("graphql") ||
    urlLower.includes("json") ||
    urlLower.includes("data")
  ) {
    return "functional";
  }

  return "unknown";
};

export interface ExtendedNetworkRequest extends NetworkRequest {
  isCompleted?: boolean;
  headers?: Record<string, string>;
  response?: string;
  timing?: {
    dns: number;
    connect: number;
    ssl: number;
    send: number;
    wait: number;
    receive: number;
  };
  isReplay?: boolean;
  originalId?: string;
}

export function DevToolsPanel() {
  const [requests, setRequests] = useState<ExtendedNetworkRequest[]>([]);
  const [domainInfo, setDomainInfo] = useState<DomainInfo[]>([]);
  const [selectedRequest, setSelectedRequest] =
    useState<ExtendedNetworkRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [replayDialogOpen, setReplayDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] =
    useState<ExtendedNetworkRequest | null>(null);
  const [replayHistory, setReplayHistory] = useState<ExtendedNetworkRequest[]>(
    []
  );
  const [isReplaying, setIsReplaying] = useState(false);
  const [isRecording, setIsRecording] = useState(true);

  // Load initial requests and listen for updates
  useEffect(() => {
    const enhanceRequests = (requestList: ExtendedNetworkRequest[]) => {
      return requestList
        .map((req: ExtendedNetworkRequest) => ({
          ...req,
          isCompleted: true,
          timestamp: req.timestamp || 0,
          headers: req.headers || {},
          response: req.response || "",
          statusCode: req?.statusCode,
          timing: {
            dns: Math.random() * 20,
            connect: Math.random() * 50,
            ssl: Math.random() * 30,
            send: Math.random() * 10,
            wait: Math.random() * 200,
            receive: Math.random() * 15,
          },
          category: categorizeRequest(req.url, req.type),
        }))
        .sort((a, b) => {
          // Sort by ID in descending order (most recent first)
          const idA = typeof a.id === "string" ? parseInt(a.id) || 0 : a.id;
          const idB = typeof b.id === "string" ? parseInt(b.id) || 0 : b.id;
          return idB - idA;
        });
    };

    // Initial load
    if (
      typeof chrome !== "undefined" &&
      chrome.runtime &&
      chrome.runtime.sendMessage
    ) {
      chrome.runtime.sendMessage({ type: "GET_REQUESTS" }, (response) => {
        if (chrome.runtime.lastError) {
          console.log("Chrome runtime error:", chrome.runtime.lastError);
          return;
        }

        if (response && response.requests) {
          const enhancedRequests = enhanceRequests(response.requests);
          setRequests(enhancedRequests);
          if (enhancedRequests.length > 0 && !selectedRequest) {
            setSelectedRequest(enhancedRequests[0]);
          }
        }
      });
      chrome.runtime.sendMessage({ type: "GET_PRIVACY_STATS" }, (response) => {
        if (chrome.runtime.lastError) {
          console.log("Chrome runtime error:", chrome.runtime.lastError);
          return;
        }
        if (response && response.privacyStats) {
          setDomainInfo(response.privacyStats);
        }
      });

      // Listen for updates
      const listener = (message: any) => {
        if (message.type === "REQUEST_UPDATED" && isRecording) {
          chrome.runtime.sendMessage({ type: "GET_REQUESTS" }, (response) => {
            if (chrome.runtime.lastError) {
              console.log("Chrome runtime error:", chrome.runtime.lastError);
              return;
            }

            if (response && response.requests) {
              const enhancedRequests = enhanceRequests(response.requests);
              setRequests((prev) => {
                // Maintain sequence by merging new requests with existing ones
                const existingIds = new Set(prev.map((r) => r.id));
                const newRequests = enhancedRequests.filter(
                  (r) => !existingIds.has(r.id)
                );

                if (newRequests.length > 0) {
                  // Add new requests to the beginning and sort by ID
                  const combined = [...newRequests, ...prev].sort((a, b) => {
                    const idA =
                      typeof a.id === "string" ? parseInt(a.id) || 0 : a.id;
                    const idB =
                      typeof b.id === "string" ? parseInt(b.id) || 0 : b.id;
                    return idB - idA;
                  });
                  return combined;
                }
                return prev;
              });
            }
          });
        }
      };

      chrome.runtime.onMessage.addListener(listener);
      return () => chrome.runtime.onMessage.removeListener(listener);
    } else {
      // Fallback for development/testing without Chrome extension
      console.log("Chrome extension APIs not available");
    }
  }, [isRecording, selectedRequest]);

  // Enhanced filtering
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || request.category === filterCategory;

    let matchesStatus = true;
    if (filterStatus === "success" && request.statusCode) {
      matchesStatus = request?.statusCode >= 200 && request?.statusCode < 300;
    } else if (filterStatus === "error" && request.statusCode) {
      matchesStatus = request?.statusCode >= 400;
    } else if (filterStatus === "pending") {
      matchesStatus = !request?.isCompleted || request?.statusCode === 0;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleClearRequests = () => {
    setRequests([]);
    setSelectedRequest(null);
    setReplayHistory([]);
    // if (
    //   typeof chrome !== "undefined" &&
    //   chrome.runtime &&
    //   chrome.runtime.sendMessage
    // ) {
    //   chrome.runtime.sendMessage({ type: "CLEAR_REQUESTS" });
    // }
  };

  const handleReplayRequest = (request: ExtendedNetworkRequest) => {
    setEditingRequest({
      ...request,
      id: `replay_${Date.now()}`,
      isReplay: true,
      originalId: request.id,
    });
    setReplayDialogOpen(true);
  };

  const executeReplay = async () => {
    if (!editingRequest) return;

    setIsReplaying(true);

    try {
      // Generate a unique ID that maintains sequence
      const maxId = Math.max(
        ...requests.map((r) => {
          const id = typeof r.id === "string" ? parseInt(r.id) || 0 : r.id;
          return id;
        }),
        0
      );

      // Create the replayed request
      const replayedRequest: ExtendedNetworkRequest = {
        ...editingRequest,
        id: `${maxId + 1}`, // Ensure it appears at the top
        timestamp: new Date().getSeconds(),
        timing: {
          dns: Math.random() * 20,
          connect: Math.random() * 50,
          ssl: Math.random() * 30,
          send: Math.random() * 10,
          wait: Math.random() * 200,
          receive: Math.random() * 15,
        },
      };

      // Add to replay history (keep only last 10)
      setReplayHistory((prev) => [replayedRequest, ...prev].slice(0, 10));

      // Add to main requests list at the top
      setRequests((prev) => {
        const updated = [replayedRequest, ...prev];
        // Sort to maintain proper sequence
        return updated.sort((a, b) => {
          const idA = typeof a.id === "string" ? parseInt(a.id) || 0 : a.id;
          const idB = typeof b.id === "string" ? parseInt(b.id) || 0 : b.id;
          return idB - idA;
        });
      });

      // Select the new replayed request
      setSelectedRequest(replayedRequest);

      setTimeout(() => {
        setIsReplaying(false);
        setReplayDialogOpen(false);
        setEditingRequest(null);
      }, 1000);
    } catch (error) {
      console.error("Replay failed:", error);
      setIsReplaying(false);
    }
  };

  const updateEditingRequest = (field: string, value: string) => {
    setEditingRequest((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : null
    );
  };

  const updateEditingHeaders = (headers: Record<string, string>) => {
    setEditingRequest((prev) =>
      prev
        ? {
            ...prev,
            headers,
          }
        : null
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Calculate statistics
  const totalSize = filteredRequests.reduce(
    (acc, req) => acc + (req.size || 0),
    0
  );
  const successCount = filteredRequests.filter(
    (r) => r.statusCode && r.statusCode >= 200 && r.statusCode < 300
  ).length;
  const errorCount = filteredRequests.filter(
    (r) => r.statusCode && r.statusCode >= 400
  ).length;
  const pendingCount = filteredRequests.filter(
    (r) => !r.isCompleted || !r.statusCode
  ).length;

  return (
    <Tabs defaultValue="network-monitor" className="p-5 flex-1 flex flex-col">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="network-monitor">Network Monitor</TabsTrigger>
        <TabsTrigger value="privacy-dashboard">Privacy Dashboard</TabsTrigger>
      </TabsList>
      <TabsContent value="privacy-dashboard">
        <DomainPrivacyDashboard domains={domainInfo} />
      </TabsContent>
      {/* Main Content */}
      <TabsContent value="network-monitor">
        <div className="flex h-[90dvh] bg-background">
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Network Monitor</h1>
                <div className="flex items-center gap-2">
                  <Button
                    variant={isRecording ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    {isRecording ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Recording
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Record
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearRequests}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="ads">Ads</SelectItem>
                    <SelectItem value="privacy">Privacy</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="functional">Functional</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Replay History */}
              {replayHistory.length > 0 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <RotateCcw className="h-5 w-5" />
                      Recent Replays ({replayHistory.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {replayHistory.slice(0, 5).map((replay) => (
                        <div
                          key={replay.id}
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {replay.method}
                            </Badge>
                            <span className="text-sm truncate max-w-[200px]">
                              {replay.url}
                            </span>
                            <span
                              className={`text-xs ${getStatusColor(
                                replay?.statusCode || 0,
                                replay.isCompleted
                              )}`}
                            >
                              {replay.statusCode}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleReplayRequest(replay)}
                            >
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setSelectedRequest(replay)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button> */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Requests Table */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <Table className="px-10">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Status</TableHead>
                      <TableHead className="w-[80px]">Method</TableHead>
                      <TableHead className="min-w-[300px]">URL</TableHead>
                      <TableHead className="w-[120px]">Category</TableHead>
                      <TableHead className="w-[80px]">Size</TableHead>
                      <TableHead className="w-[80px]">Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <Sheet key={request.id}>
                        <SheetTrigger asChild>
                          <TableRow
                            className="cursor-pointer hover:bg-muted/50 group"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(
                                  request.statusCode || 0,
                                  request.isCompleted
                                )}
                                <span
                                  className={`text-sm font-medium ${getStatusColor(
                                    request.statusCode || 0,
                                    request.isCompleted
                                  )}`}
                                >
                                  {!request.isCompleted
                                    ? "..."
                                    : request.statusCode || "N/A"}
                                </span>
                                {request.isReplay && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Replay
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="font-mono text-xs"
                              >
                                {request.method}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-between">
                                <div
                                  className="truncate max-w-[250px]"
                                  title={request.url}
                                >
                                  {request.url}
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReplayRequest(request);
                                    }}
                                    title="Replay request"
                                  >
                                    <RotateCcw className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(request.url);
                                    }}
                                    title="Copy URL"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${getCategoryColor(
                                  request.category
                                )} border`}
                              >
                                <div className="flex items-center gap-1">
                                  {getCategoryIcon(request.category)}
                                  <span className="text-xs">
                                    {request.category}
                                  </span>
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatSize(request.size || 0)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {request.type || "N/A"}
                            </TableCell>
                          </TableRow>
                        </SheetTrigger>

                        {/* Request Details Sheet */}
                        <SheetContent className="w-full sm:max-w-2xl">
                          <SheetHeader>
                            <SheetTitle className="flex items-center gap-2">
                              {selectedRequest &&
                                getStatusIcon(
                                  selectedRequest?.statusCode || 0,
                                  selectedRequest.isCompleted
                                )}
                              <span
                                className={
                                  selectedRequest
                                    ? getStatusColor(
                                        selectedRequest?.statusCode || 0,
                                        selectedRequest.isCompleted
                                      )
                                    : ""
                                }
                              >
                                {selectedRequest?.method}{" "}
                                {selectedRequest?.statusCode || "N/A"}
                              </span>
                            </SheetTitle>
                            <SheetDescription className="text-left break-all line-clamp-5">
                              {selectedRequest?.url}
                            </SheetDescription>
                          </SheetHeader>

                          {selectedRequest && (
                            <div className="mt-6 mx-10">
                              <Tabs defaultValue="headers" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="headers">
                                    Headers
                                  </TabsTrigger>
                                  <TabsTrigger value="response">
                                    Response
                                  </TabsTrigger>
                                  <TabsTrigger value="timing">
                                    Timing
                                  </TabsTrigger>
                                  <TabsTrigger value="overview">
                                    Overview
                                  </TabsTrigger>
                                </TabsList>

                                <TabsContent value="headers" className="mt-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">
                                        Request Headers
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2 max-h-[60dvh] overflow-auto">
                                        {selectedRequest.headers &&
                                        Object.keys(selectedRequest.headers)
                                          .length > 0 ? (
                                          Object.entries(
                                            selectedRequest.headers
                                          ).map(([key, value]) => (
                                            <div
                                              key={key}
                                              className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b"
                                            >
                                              <Label className="font-mono text-sm text-muted-foreground">
                                                {key}:
                                              </Label>
                                              <div className="sm:col-span-2 font-mono text-sm break-all">
                                                {value}
                                              </div>
                                            </div>
                                          ))
                                        ) : (
                                          <div className="text-sm text-muted-foreground">
                                            No headers available
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>

                                <TabsContent value="response" className="mt-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">
                                        Response Body
                                      </CardTitle>
                                      <CardDescription>
                                        Size:{" "}
                                        {formatSize(selectedRequest.size || 0)}{" "}
                                        • Type: {selectedRequest.type || "N/A"}
                                      </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                      <Textarea
                                        value={
                                          selectedRequest.response ||
                                          "No response data available"
                                        }
                                        readOnly
                                        className="min-h-[200px] font-mono text-sm"
                                        placeholder="No response body"
                                      />
                                    </CardContent>
                                  </Card>
                                </TabsContent>

                                <TabsContent value="timing" className="mt-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">
                                        Request Timing
                                      </CardTitle>
                                      <CardDescription>
                                        Estimated timing breakdown
                                      </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        {selectedRequest.timing ? (
                                          Object.entries(
                                            selectedRequest.timing
                                          ).map(([phase, time]) => (
                                            <div
                                              key={phase}
                                              className="space-y-2"
                                            >
                                              <div className="flex justify-between items-center">
                                                <Label className="capitalize">
                                                  {phase}
                                                </Label>
                                                <span className="text-sm text-muted-foreground">
                                                  {formatTime(time)}
                                                </span>
                                              </div>
                                              <Progress
                                                value={(time / 250) * 100}
                                                className="h-2 text-green-600"
                                              />
                                            </div>
                                          ))
                                        ) : (
                                          <div className="text-sm text-muted-foreground">
                                            Timing data not available
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>

                                <TabsContent value="overview" className="mt-4">
                                  <div className="grid gap-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">
                                          Request Overview
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                          <div>
                                            <Label className="text-muted-foreground">
                                              Method
                                            </Label>
                                            <div className="font-mono">
                                              {selectedRequest.method}
                                            </div>
                                          </div>
                                          <div>
                                            <Label className="text-muted-foreground">
                                              Status
                                            </Label>
                                            <div
                                              className={`font-mono ${getStatusColor(
                                                selectedRequest?.statusCode ||
                                                  0,
                                                selectedRequest.isCompleted
                                              )}`}
                                            >
                                              {selectedRequest?.statusCode ||
                                                "N/A"}
                                            </div>
                                          </div>
                                          <div>
                                            <Label className="text-muted-foreground">
                                              Category
                                            </Label>
                                            <Badge
                                              className={`${getCategoryColor(
                                                selectedRequest.category
                                              )} border mt-1`}
                                            >
                                              <div className="flex items-center gap-1">
                                                {getCategoryIcon(
                                                  selectedRequest.category
                                                )}
                                                <span className="text-xs">
                                                  {selectedRequest.category}
                                                </span>
                                              </div>
                                            </Badge>
                                          </div>
                                          <div>
                                            <Label className="text-muted-foreground">
                                              Type
                                            </Label>
                                            <div>
                                              {selectedRequest.type || "N/A"}
                                            </div>
                                          </div>
                                          <div>
                                            <Label className="text-muted-foreground">
                                              Size
                                            </Label>
                                            <div>
                                              {formatSize(
                                                selectedRequest.size || 0
                                              )}
                                            </div>
                                          </div>
                                          <div>
                                            <Label className="text-muted-foreground">
                                              Timestamp
                                            </Label>
                                            <div>
                                              {new Date(
                                                selectedRequest.timestamp
                                              ).toLocaleString() || "N/A"}
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </div>
                          )}
                        </SheetContent>
                      </Sheet>
                    ))}
                  </TableBody>
                </Table>
                {filteredRequests.length === 0 && (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground">
                        No requests found
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {!isRecording
                          ? "Start recording to capture network requests"
                          : "Browse a website to see network activity"}
                      </p>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Summary Bar */}
            <div className="border-t p-4 bg-muted/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>{filteredRequests.length} requests</span>
                  <span>{formatSize(totalSize)} transferred</span>
                  <span>Last update: {new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{successCount} Success</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">{errorCount} Error</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{pendingCount} Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Request Editor Dialog */}
          <Dialog open={replayDialogOpen} onOpenChange={setReplayDialogOpen}>
            <DialogContent className="sm:max-w-[80dvw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Replay & Modify Request
                </DialogTitle>
                <DialogDescription>
                  Modify the request parameters and replay it to test different
                  scenarios.
                </DialogDescription>
              </DialogHeader>

              {editingRequest && (
                <div className="space-y-6 mt-4">
                  {/* Request Method and URL */}
                  <div className="flex items-center gap-4">
                    <div>
                      <Label htmlFor="method">Method</Label>
                      <Select
                        value={editingRequest.method}
                        onValueChange={(value) =>
                          updateEditingRequest("method", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                          <SelectItem value="HEAD">HEAD</SelectItem>
                          <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full">
                      <Label htmlFor="url">URL</Label>
                      <Input
                        id="url"
                        value={editingRequest.url}
                        onChange={(e) =>
                          updateEditingRequest("url", e.target.value)
                        }
                        placeholder="https://api.example.com/endpoint"
                      />
                    </div>
                  </div>

                  <Tabs defaultValue="headers" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="headers">Headers</TabsTrigger>
                      <TabsTrigger value="body">Request Body</TabsTrigger>
                      <TabsTrigger value="params">Query Params</TabsTrigger>
                    </TabsList>

                    <TabsContent value="headers" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Request Headers
                          </CardTitle>
                          <CardDescription>
                            Modify or add request headers. Each header should be
                            on a new line in the format "Key: Value"
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Textarea
                            value={Object.entries(editingRequest.headers || {})
                              .map(([key, value]) => `${key}: ${value}`)
                              .join("\n")}
                            onChange={(e) => {
                              const headers: Record<string, string> = {};

                              e.target.value.split("\n").forEach((line) => {
                                const trimmed = line.trim();
                                if (!trimmed) return; // skip empty lines

                                const separatorIndex = trimmed.indexOf(":");
                                if (separatorIndex === -1) return; // skip invalid lines

                                const key = trimmed
                                  .slice(0, separatorIndex)
                                  .trim();
                                const value = trimmed
                                  .slice(separatorIndex + 1)
                                  .trim();

                                if (key) {
                                  headers[key] = value;
                                }
                              });

                              updateEditingHeaders(headers);
                            }}
                            placeholder={`Content-Type: application/json
Authorization: Bearer token123`}
                            className="min-h-[150px] font-mono text-sm"
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="body" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Request Body
                          </CardTitle>
                          <CardDescription>
                            Enter the request body content (JSON, form data,
                            etc.)
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Textarea
                            value={(editingRequest as any).requestBody || ""}
                            onChange={(e) =>
                              updateEditingRequest(
                                "requestBody",
                                e.target.value
                              )
                            }
                            placeholder='{"key": "value"}'
                            className="min-h-[200px] font-mono text-sm"
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="params" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Query Parameters
                          </CardTitle>
                          <CardDescription>
                            Add or modify URL query parameters. Each parameter
                            should be on a new line in the format "key=value"
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Textarea
                            value={(editingRequest as any).queryParams || ""}
                            onChange={(e) =>
                              updateEditingRequest(
                                "queryParams",
                                e.target.value
                              )
                            }
                            placeholder="page=1&#10;limit=10&#10;sort=name"
                            className="min-h-[100px] font-mono text-sm"
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save Template
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const curlCommand =
                            `curl -X ${editingRequest.method} '${editingRequest.url}'` +
                            (editingRequest.headers
                              ? Object.entries(editingRequest.headers)
                                  .map(
                                    ([key, value]) => ` -H '${key}: ${value}'`
                                  )
                                  .join("")
                              : "") +
                            ((editingRequest as any).requestBody
                              ? ` -d '${(editingRequest as any).requestBody}'`
                              : "");
                          copyToClipboard(curlCommand);
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy as cURL
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setReplayDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={executeReplay} disabled={isReplaying}>
                        {isReplaying ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Request
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Original vs Modified Comparison */}
                  {editingRequest.originalId && (
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Request Comparison
                        </CardTitle>
                        <CardDescription>
                          Compare the original request with your modifications
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              Original
                            </Label>
                            <div className="mt-2 p-3 bg-muted rounded-md">
                              <div className="text-sm font-mono text-wrap line-clamp-4">
                                {
                                  requests.find(
                                    (r) => r.id === editingRequest.originalId
                                  )?.method
                                }{" "}
                                {
                                  requests.find(
                                    (r) => r.id === editingRequest.originalId
                                  )?.url
                                }
                              </div>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              Modified
                            </Label>
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                              <div className="text-sm font-mono text-wrap line-clamp-4">
                                {editingRequest.method} {editingRequest.url}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </TabsContent>
    </Tabs>
  );
}
