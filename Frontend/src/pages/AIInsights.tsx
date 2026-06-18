import { useEffect, useState, useCallback, type JSX } from "react";
import { Sparkles, Globe, Loader2, X, RefreshCw } from "lucide-react";
import { getMonitors } from "@/api/monitorApi";
import { generateInsight } from "@/api/aiInsightApi";
import type { MonitorResponse } from "@/types/monitor";

interface Insight {
  summary: string;
  possibleCause: string[];
  recommendation: string[];
}

export default function AIInsights() {
  const [monitors, setMonitors] = useState<MonitorResponse[]>([]);
  const [loadingMonitors, setLoadingMonitors] = useState(true);
  const [loadingMonitorId, setLoadingMonitorId] = useState<string | null>(null);
  const [selectedMonitor, setSelectedMonitor] = useState<MonitorResponse | null>(null);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadMonitors = useCallback(async () => {
    try {
      setError(null);
      setLoadingMonitors(true);
      const response = await getMonitors();
      setMonitors(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load monitors. Please try again.");
    } finally {
      setLoadingMonitors(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMonitors();
  }, [loadMonitors]);

  const handleGenerate = async (monitor: MonitorResponse) => {
    try {
      setError(null);
      setLoadingMonitorId(monitor.id);
      const response = await generateInsight(monitor.id);

      setSelectedMonitor(monitor);
      setInsight(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate insight. Please try again.");
    } finally {
      setLoadingMonitorId(null);
    }
  };

  const closeInsight = () => {
    setSelectedMonitor(null);
    setInsight(null);
  };

  // Enhanced content formatter for AI responses
  const formatInsightContent = (
  content: string | string[]
): JSX.Element[] => {
  if (!content) {
    return [
      <p key="empty" className="text-zinc-400">
        No content available.
      </p>,
    ];
  }

  if (Array.isArray(content)) {
    return content.map((item, index) => (
      <li
        key={index}
        className="ml-6 text-zinc-300 leading-relaxed list-disc"
      >
        {item}
      </li>
    ));
  }

  const lines = content.trim().split(/\n+/);

  return lines.map((line, index) => {
    const trimmed = line.trim();

    if (/^\d+\.\s/.test(trimmed)) {
      return (
        <li
          key={index}
          className="ml-6 text-zinc-300 leading-relaxed list-disc"
        >
          {trimmed.replace(/^\d+\.\s*/, "")}
        </li>
      );
    }

    if (/^[-•*]\s/.test(trimmed)) {
      return (
        <li
          key={index}
          className="ml-6 text-zinc-300 leading-relaxed list-disc"
        >
          {trimmed.replace(/^[-•*]\s*/, "")}
        </li>
      );
    }

    return (
      <p key={index} className="text-zinc-300 leading-relaxed">
        {trimmed}
      </p>
    );
  });
};

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            AI Insights <Sparkles className="text-emerald-500" size={32} />
          </h1>
          <p className="mt-2 text-zinc-400 text-lg">
            Intelligent analysis and actionable recommendations for your monitors
          </p>
        </div>

        <button
          onClick={loadMonitors}
          disabled={loadingMonitors}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-zinc-700 hover:bg-zinc-900 transition-colors disabled:opacity-60"
        >
          <RefreshCw size={18} className={loadingMonitors ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-950/50 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
          <span>{error}</span>
          <button onClick={loadMonitors} className="underline hover:no-underline ml-auto">
            Retry
          </button>
        </div>
      )}

      {/* Monitors List */}
      {loadingMonitors ? (
        <AIMonitorsSkeleton />
      ) : monitors.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
          <Globe className="mx-auto text-zinc-600 mb-4" size={48} />
          <p className="text-zinc-400">No monitors found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {monitors.map((monitor) => (
            <div
              key={monitor.id}
              className="group rounded-3xl border border-zinc-800 bg-zinc-950 p-6 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Globe className="text-emerald-500" size={22} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg truncate">{monitor.name}</h3>
                      <p className="text-sm text-zinc-400 truncate mt-0.5">{monitor.url}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-500">
                    <span className="capitalize">{monitor.type.toLowerCase()}</span>
                    <span>Every {monitor.intervalSeconds}s</span>
                    <span className={monitor.active ? "text-emerald-400" : "text-red-400"}>
                      ● {monitor.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleGenerate(monitor)}
                disabled={loadingMonitorId === monitor.id}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-semibold text-black hover:bg-white/90 active:scale-[0.985] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loadingMonitorId === monitor.id ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Insight
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* AI Insight Result */}
      {insight && selectedMonitor && (
        <div className="rounded-3xl border border-emerald-500/30 bg-zinc-950 p-8 relative">
          <button
            onClick={closeInsight}
            className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors"
            aria-label="Close insight"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Sparkles className="text-emerald-500" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold">AI Analysis</h2>
              <p className="text-emerald-400 text-xl mt-1">{selectedMonitor.name}</p>
            </div>
          </div>

          <div className="space-y-10">
            <InsightSection
              title="Summary"
              content={insight.summary}
              formatter={formatInsightContent}
            />
            <InsightSection
              title="Possible Cause"
              content={insight.possibleCause}
              formatter={formatInsightContent}
            />
            <InsightSection
              title="Recommendation"
              content={insight.recommendation}
              formatter={formatInsightContent}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== Insight Section ==================== */
function InsightSection({
  title,
  content,
  formatter,
}: {
  title: string;
  content: string | string[];
  formatter: (content: string | string[]) => JSX.Element[];
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 p-8 bg-zinc-900/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Sparkles size={20} className="text-emerald-500" />
        </div>
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
      </div>

      <div className="space-y-4 text-[15.5px] leading-relaxed">
        <ul className="space-y-3">{formatter(content)}</ul>
      </div>
    </div>
  );
}

/* ==================== Skeleton ==================== */
function AIMonitorsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-64 bg-zinc-900 border border-zinc-800 rounded-3xl animate-pulse"
        />
      ))}
    </div>
  );
}