import { useEffect, useState } from "react";
import {  Globe, Clock, Search, X } from "lucide-react";
import { getMonitors, getMonitorHistory } from "@/api/monitorApi";
import type { MonitorResponse, MonitorHistoryResponse } from "@/types/monitor";

type MonitorWithHistory = MonitorResponse & { history: MonitorHistoryResponse[] };

export default function MonitorChecks() {
  const [monitors, setMonitors] = useState<MonitorWithHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const monitorRes = await getMonitors();
      const monitorsData = monitorRes.data;

      const monitorsWithHistory = await Promise.all(
        monitorsData.map(async (monitor: MonitorResponse) => {
          try {
            const historyRes = await getMonitorHistory(monitor.id);
            return { ...monitor, history: historyRes.data };
          } catch {
            return { ...monitor, history: [] };
          }
        })
      );

      setMonitors(monitorsWithHistory);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter monitors based on search term
  const filteredMonitors = monitors.filter((monitor) =>
    monitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    monitor.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => setSearchTerm("");

  if (loading) return <MonitorChecksSkeleton />;

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Monitor Checks</h1>
        <p className="mt-2 text-zinc-400">Recent health checks across all monitors</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search monitors by name or URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 pl-11 pr-10 py-3 rounded-2xl focus:border-emerald-500 outline-none transition-colors text-white placeholder:text-zinc-500"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {filteredMonitors.length === 0 ? (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-12 text-center">
          <Search className="mx-auto mb-4 text-zinc-500" size={48} />
          <h3 className="text-xl font-semibold">No matching monitors</h3>
          <p className="text-zinc-400 mt-2">Try adjusting your search term</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMonitors.map((monitor) => (
            <div
              key={monitor.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Globe className="text-emerald-500" size={28} />
                  <div>
                    <h2 className="text-2xl font-semibold">{monitor.name}</h2>
                    <p className="text-zinc-400 break-all">{monitor.url}</p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${
                    monitor.active
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {monitor.active ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>

              <h3 className="mb-4 font-medium flex items-center gap-2">
                <Clock size={18} />
                Recent Checks (Last 10)
              </h3>

              {monitor.history.length === 0 ? (
                <p className="text-zinc-500 py-8 text-center">No check history available yet.</p>
              ) : (
                <div className="space-y-2 max-h-[420px] overflow-auto pr-2">
                  {monitor.history.slice(0, 10).map((check, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-2xl border border-zinc-800 p-4 hover:bg-zinc-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            check.healthy ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />
                        <div>
                          <div className="font-mono text-sm">
                            {check.statusCode}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {new Date(check.checkedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-medium">{check.latencyMs} ms</div>
                        <div
                          className={`text-sm font-medium ${
                            check.healthy ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {check.healthy ? "Healthy" : "Failed"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MonitorChecksSkeleton() {
  return (
    <div className="space-y-8 p-6">
      <div className="h-10 w-72 bg-zinc-800 rounded-xl animate-pulse" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-80 bg-zinc-800 rounded-3xl animate-pulse" />
      ))}
    </div>
  );
}