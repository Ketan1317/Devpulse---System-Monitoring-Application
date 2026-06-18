import { useEffect, useState } from "react";
import { Sparkles, Globe, Loader2, } from "lucide-react";
import { getMonitors } from "@/api/monitorApi";
import { generateInsight } from "@/api/aiInsightApi";
import type { MonitorResponse } from "@/types/monitor";

interface Insight {
  summary: string;
  possibleCause: string;
  recommendation: string;
}

export default function AIInsights() {
  const [monitors, setMonitors] = useState<MonitorResponse[]>([]);
  const [loadingMonitors, setLoadingMonitors] = useState(true);
  const [loadingMonitorId, setLoadingMonitorId] = useState<string | null>(null);
  const [selectedMonitor, setSelectedMonitor] = useState<MonitorResponse | null>(null);
  const [insight, setInsight] = useState<Insight | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadMonitors();
  }, []);

  const loadMonitors = async () => {
    try {
      const response = await getMonitors();
      setMonitors(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMonitors(false);
    }
  };

  const handleGenerate = async (monitor: MonitorResponse) => {
    try {
      setLoadingMonitorId(monitor.id);
      const response = await generateInsight(monitor.id);

      setSelectedMonitor(monitor);
      setInsight(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMonitorId(null);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">AI Insights</h1>
        <p className="mt-2 text-zinc-400">
          Get intelligent analysis and recommendations for your monitors
        </p>
      </div>

      {loadingMonitors ? (
        <AIMonitorsSkeleton />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {monitors.map((monitor) => (
            <div
              key={monitor.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Globe className="text-emerald-500" size={24} />
                    <div>
                      <h3 className="font-semibold text-lg">{monitor.name}</h3>
                      <p className="text-sm text-zinc-400 break-all mt-1">{monitor.url}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-4 text-sm text-zinc-500">
                    <span className="capitalize">{monitor.type.toLowerCase()}</span>
                    <span>Every {monitor.intervalSeconds}s</span>
                    {monitor.active ? (
                      <span className="text-emerald-400">● Active</span>
                    ) : (
                      <span className="text-red-400">● Inactive</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleGenerate(monitor)}
                  disabled={loadingMonitorId === monitor.id}
                  className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-medium text-black hover:bg-white/90 transition-colors disabled:opacity-70"
                >
                  {loadingMonitorId === monitor.id ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Get Insight
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================== AI INSIGHT RESULT ==================== */}
      {insight && selectedMonitor && (
        <div className="rounded-3xl border border-emerald-500/30 bg-zinc-950 p-8">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="text-emerald-500" size={32} />
            <div>
              <h2 className="text-3xl font-bold">AI Analysis</h2>
              <p className="text-emerald-400 text-lg">{selectedMonitor.name}</p>
            </div>
          </div>

          <div className="space-y-10">
            <InsightSection title="Summary" content={insight.summary} />
            <InsightSection title="Possible Cause" content={insight.possibleCause} />
            <InsightSection title="Recommendation" content={insight.recommendation} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== Reusable Insight Section ==================== */
function InsightSection({ title, content }: { title: string; content: string }) {
  // Convert numbered lists (1., 2., etc.) into proper bullet points
  const formattedContent = content
    .replace(/(\d+)\.\s/g, "\n• ")
    .split("\n")
    .map((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("•")) {
        return (
          <li key={index} className="ml-6 text-zinc-300 leading-relaxed">
            {trimmed.replace("• ", "")}
          </li>
        );
      }
      return <p key={index} className="text-zinc-300 leading-relaxed">{trimmed}</p>;
    });

  return (
    <div className="rounded-2xl border border-zinc-800 p-7">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Sparkles size={18} className="text-emerald-500" />
        </div>
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
      </div>

      <div className="space-y-4 text-[15px]">
        {formattedContent}
      </div>
    </div>
  );
}

/* Skeleton */
function AIMonitorsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-48 bg-zinc-800 rounded-3xl animate-pulse" />
      ))}
    </div>
  );
}