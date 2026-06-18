import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createMonitor } from "@/api/monitorApi";
import type { CreateMonitorRequest, MonitorType } from "@/types/monitor";

export default function CreateMonitor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<CreateMonitorRequest>({
    name: "",
    url: "",
    type: "WEBSITE",
    intervalSeconds: 60,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) return toast.error("Monitor name is required");
    if (!formData.url.trim()) return toast.error("URL is required");

    try {
      setLoading(true);
      await createMonitor(formData);
      toast.success("Monitor created successfully!");
      navigate("/monitors");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create monitor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Create New Monitor</h1>
        <p className="mt-2 text-zinc-400">Add a website or API endpoint to monitor</p>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium mb-2">Monitor Name</label>
            <input
              type="text"
              placeholder="Production API"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 focus:border-emerald-500 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL / Endpoint</label>
            <input
              type="url"
              placeholder="https://api.example.com/health"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 focus:border-emerald-500 outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as MonitorType })}
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 focus:border-emerald-500 outline-none"
              >
                <option value="WEBSITE">Website</option>
                <option value="API">API</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Check Interval (seconds)</label>
              <input
                type="number"
                min={30}
                value={formData.intervalSeconds}
                onChange={(e) => setFormData({ ...formData, intervalSeconds: Number(e.target.value) })}
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 text-black font-semibold py-4 rounded-2xl transition-all"
          >
            {loading ? "Creating Monitor..." : "Create Monitor"}
          </button>
        </form>
      </div>
    </div>
  );
}