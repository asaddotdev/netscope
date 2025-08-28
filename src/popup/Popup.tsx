// import { useEffect, useState } from "react";
// import type { RequestStats } from "../types/network";

// export function Popup() {
//   const [stats, setStats] = useState<RequestStats | null>(null);

//   useEffect(() => {
//     chrome.runtime.sendMessage({ type: "GET_STATS" }, (response) => {
//       setStats(response.stats);
//     });
//   }, []);

//   if (!stats) {
//     return <div className="p-4">Loading...</div>;
//   }

//   return (
//     <div className="p-4 w-80">
//       <h1 className="text-xl font-bold mb-4">NetScope</h1>

//       <div className="space-y-4">
//         <div>
//           <h2 className="font-semibold">Request Summary</h2>
//           <p>Total Requests: {stats.totalRequests}</p>
//           <p>Total Size: {(stats.totalSize / 1024).toFixed(1)} KB</p>
//           <p>Unique Domains: {stats.domains.size}</p>
//         </div>

//         <div>
//           <h2 className="font-semibold">Request Categories</h2>
//           <ul className="space-y-1">
//             {Object.entries(stats.byCategory).map(([category, count]) => (
//               <li key={category} className="flex justify-between">
//                 <span className="capitalize">{category}</span>
//                 <span>{count}</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <button
//           className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           onClick={() => {
//             chrome.runtime.sendMessage({ type: "CLEAR_DATA" }, () => {
//               window.close();
//             });
//           }}
//         >
//           Clear Data
//         </button>
//       </div>
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Network, Shield, BarChart3, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { RequestStats } from "@/types/network";

const COLORS: Record<string, string> = {
  content: "bg-blue-500",
  analytics: "bg-green-500",
  ads: "bg-red-500",
  functional: "bg-purple-500",
  security: "bg-orange-500",
  unknown: "bg-gray-500",
};

export default function Popup() {
  const [stats, setStats] = useState<RequestStats | null>(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_STATS" }, (response) => {
      setStats(response.stats);
    });
  }, []);

  if (!stats) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-80 bg-gray-900 text-white min-h-[400px]">
      <Card className="bg-gray-900 border-gray-700 text-white shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Network className="w-6 h-6 text-blue-400" />
            NetScope
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Request Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <h3 className="text-lg font-semibold">Request Summary</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-300">Total Requests:</span>
                <Badge variant="secondary" className="bg-blue-600 text-white">
                  {stats.totalRequests}
                </Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-300">Total Size:</span>
                <Badge variant="secondary" className="bg-green-600 text-white">
                  {stats.totalSize >= 1024 * 1024
                    ? `${(stats.totalSize / (1024 * 1024)).toFixed(2)} MB`
                    : stats.totalSize >= 1024
                    ? `${(stats.totalSize / 1024).toFixed(1)} KB`
                    : `${stats.totalSize} B`}
                </Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-300">Unique Domains:</span>
                <Badge variant="secondary" className="bg-purple-600 text-white">
                  {stats.domains.size}
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Request Categories */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-blue-400" />
              <h3 className="text-lg font-semibold">Request Categories</h3>
            </div>

            <div className="space-y-2">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div
                  key={category}
                  className="flex justify-between items-center p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${COLORS[category]}`}
                    />
                    <span className="text-gray-300 capitalize">{category}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`border-gray-600 ${
                      count > 0 ? "text-white bg-gray-700" : "text-gray-500"
                    }`}
                  >
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Clear Data Button */}
          <Button
            onClick={() => {
              chrome.runtime.sendMessage({ type: "CLEAR_DATA" }, () => {
                window.close();
              });
            }}
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
