import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Server,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useEffect, useState } from "react";
import { getDashboard, type DashboardResponse } from "@/api/dashboardApi";

const COLORS = ["#10b981", "#ef4444"];

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getDashboard();
      setDashboard(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  if (!dashboard) {
    return <div className="text-red-500 p-8 text-center">Failed to load dashboard</div>;
  }

  // Calculate accurate average latency from monitors
  const calculatedAvgLatency =
    dashboard.monitors.length > 0
      ? Math.round(
          dashboard.monitors.reduce((sum, m) => sum + (m.avgLatency || 0), 0) /
            dashboard.monitors.length
        )
      : 0;

  const healthData = [
    { name: "Healthy", value: dashboard.healthyMonitors },
    { name: "Down", value: dashboard.downMonitors },
  ];

  const latencyData = dashboard.monitors.map((monitor) => ({
    name: monitor.name.length > 14 ? monitor.name.substring(0, 14) + "..." : monitor.name,
    fullName: monitor.name,
    latency: monitor.avgLatency ?? 0,
  }));

  const uptimeData = dashboard.monitors.map((monitor) => ({
    name: monitor.name.length > 12 ? monitor.name.substring(0, 12) + "..." : monitor.name,
    uptime: monitor.uptime,
  }));

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-zinc-400">Real-time overview of your services</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Total Monitors" value={dashboard.totalMonitors} icon={<Server size={22} />} />
        <Card
          title="Healthy"
          value={dashboard.healthyMonitors}
          icon={<CheckCircle size={22} className="text-emerald-500" />}
        />
        <Card
          title="Active Incidents"
          value={dashboard.activeIncidents}
          icon={<AlertTriangle size={22} className="text-red-500" />}
        />
        <Card
          title="Avg Latency"
          value={`${calculatedAvgLatency} ms`}
          icon={<Activity size={22} />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Health Pie */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-6 font-semibold text-lg">Monitor Health</h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={healthData} cx="50%" cy="50%" innerRadius={80} outerRadius={130} dataKey="value">
                {healthData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Overall Uptime */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col items-center justify-center">
          <h2 className="mb-6 font-semibold text-lg">Overall Uptime</h2>
          <div className="text-[5.2rem] font-bold text-emerald-500 tracking-tighter">
            {dashboard.overallUptime.toFixed(1)}
            <span className="text-5xl">%</span>
          </div>
          <p className="text-zinc-400 mt-2">Average Success Rate</p>
        </div>
      </div>

      {/* Latency + Uptime Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Latency Histogram */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-6 font-semibold text-lg">Latency Histogram</h2>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={latencyData} margin={{ bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip content={({ payload }) => {
                if (payload?.[0]) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg">
                      <p className="font-medium">{d.fullName}</p>
                      <p className="text-emerald-400">{d.latency.toFixed(0)} ms</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Bar dataKey="latency" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Uptime Comparison */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-6 font-semibold text-lg">Uptime Comparison</h2>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={uptimeData} margin={{ bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="#a1a1aa" />
              <YAxis domain={[0, 100]} stroke="#a1a1aa" />
              <Tooltip />
              <Bar dataKey="uptime" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monitors Table */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="font-semibold text-lg">All Monitors</h2>
          <span className="text-sm text-zinc-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-left">
                <th className="p-5 font-medium">Monitor</th>
                <th className="p-5 font-medium">Status</th>
                <th className="p-5 font-medium">Uptime</th>
                <th className="p-5 font-medium">Avg Latency</th>
                <th className="p-5 font-medium">Incidents</th>
                <th className="p-5 font-medium">Last Checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {dashboard.monitors.map((monitor) => (
                <tr key={monitor.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="p-5 font-medium text-white">{monitor.name}</td>
                  <td className="p-5">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        monitor.status === "UP"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {monitor.status}
                    </span>
                  </td>
                  <td className="p-5 text-emerald-400 font-medium">
                    {monitor.uptime.toFixed(2)}%
                  </td>
                  <td className="p-5 text-zinc-300">
                    {monitor.avgLatency?.toFixed(0) ?? 0} ms
                  </td>
                  <td className="p-5">
                    <span className="text-orange-400 font-medium">{monitor.incidentsCount}</span>
                  </td>
                  <td className="p-5 text-zinc-500 text-sm">
                    {new Date(monitor.lastCheckedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* Card Component */
function Card({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 hover:border-emerald-500/30 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-400 text-sm">{title}</p>
          <p className="text-4xl font-bold mt-4 tracking-tight">{value}</p>
        </div>
        <div className="opacity-80">{icon}</div>
      </div>
    </div>
  );
}

/* Skeleton */
function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-3">
        <div className="h-10 w-64 bg-zinc-800 rounded-xl animate-pulse" />
        <div className="h-4 w-96 bg-zinc-800 rounded-xl animate-pulse" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-zinc-800 rounded-3xl animate-pulse" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => <div key={i} className="h-96 bg-zinc-800 rounded-3xl animate-pulse" />)}
      </div>
    </div>
  );
}