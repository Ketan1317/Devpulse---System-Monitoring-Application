import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Activity, Globe, Clock, TrendingUp, Shield 
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { getMonitorById, getMonitorHistory } from "@/api/monitorApi";
import type { MonitorResponse, MonitorHistoryResponse } from "@/types/monitor";

export default function MonitorDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [monitor, setMonitor] = useState<MonitorResponse | null>(null);
  const [history, setHistory] = useState<MonitorHistoryResponse[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [monitorRes, historyRes] = await Promise.all([
        getMonitorById(id!),
        getMonitorHistory(id!),
      ]);

      setMonitor(monitorRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <MonitorDetailSkeleton />;
  if (!monitor) return <div className="p-8 text-red-500 text-center">Monitor not found</div>;

  // Prepare chart data (last 50 checks to avoid overcrowding)
  const recentHistory = history.slice(-50);

  const latencyData = recentHistory.map((item) => ({
    time: new Date(item.checkedAt).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    latency: item.latencyMs,
    fullTime: new Date(item.checkedAt).toLocaleString(),
  }));

  const pieData = [
    { name: "Healthy", value: recentHistory.filter(h => h.healthy).length },
    { name: "Failed", value: recentHistory.filter(h => !h.healthy).length },
  ];

  const uptime = recentHistory.length === 0 
    ? 100 
    : ((recentHistory.filter(h => h.healthy).length / recentHistory.length) * 100).toFixed(2);

  const avgLatency = recentHistory.length === 0 
    ? 0 
    : Math.round(recentHistory.reduce((sum, item) => sum + item.latencyMs, 0) / recentHistory.length);

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Globe className="text-emerald-500" size={36} />
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{monitor.name}</h1>
              <p className="text-xl text-zinc-400 break-all mt-1">{monitor.url}</p>
            </div>
          </div>

          <span
            className={`px-5 py-2 rounded-2xl text-sm font-semibold ${
              monitor.active
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {monitor.active ? "● ACTIVE" : "● INACTIVE"}
          </span>
        </div>

        {/* KPI Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Uptime" value={`${uptime}%`} icon={<TrendingUp className="text-emerald-500" />} />
          <StatCard title="Avg Latency" value={`${avgLatency} ms`} icon={<Activity />} />
          <StatCard title="Total Checks" value={history.length.toString()} icon={<Clock />} />
          <StatCard 
            title="SSL Remaining" 
            value={monitor.sslDaysRemaining ? `${monitor.sslDaysRemaining} days` : "N/A"} 
            icon={<Shield />} 
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Latency Trend */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-6 font-semibold text-lg">Response Time Trend</h2>
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="time" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" />
              <Tooltip 
                labelFormatter={(label) => `Time: ${label}`}
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }}
              />
              <Line 
                type="natural" 
                dataKey="latency" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Health Distribution */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-6 font-semibold text-lg">Health Distribution</h2>
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={90}
                outerRadius={130}
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-8 mt-6">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className="text-zinc-400">{entry.name}</span>
                <span className="font-semibold">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Checks Table */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="mb-6 font-semibold text-lg">Recent Checks</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-zinc-400">
                <th className="pb-4 pl-2">Timestamp</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Status Code</th>
                <th className="pb-4">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {history.slice(0, 20).map((check, index) => (
                <tr key={index} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-4 pl-2 text-sm text-zinc-300">
                    {new Date(check.checkedAt).toLocaleString()}
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex px-4 py-1 rounded-full text-xs font-medium ${
                        check.healthy 
                          ? "bg-emerald-500/10 text-emerald-400" 
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {check.healthy ? "UP" : "DOWN"}
                    </span>
                  </td>
                  <td className="py-4 font-mono text-sm">{check.statusCode}</td>
                  <td className="py-4 font-medium">{check.latencyMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* Stat Card Component */
function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-800 p-5 bg-zinc-950">
      <div className="flex items-center justify-between text-zinc-400">
        <p className="text-sm">{title}</p>
        {icon}
      </div>
      <p className="mt-4 text-4xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

/* Skeleton Loader */
function MonitorDetailSkeleton() {
  return (
    <div className="space-y-8 p-6">
      <div className="h-52 bg-zinc-800 rounded-3xl animate-pulse" />
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-96 bg-zinc-800 rounded-3xl animate-pulse" />
        ))}
      </div>
      <div className="h-96 bg-zinc-800 rounded-3xl animate-pulse" />
    </div>
  );
}