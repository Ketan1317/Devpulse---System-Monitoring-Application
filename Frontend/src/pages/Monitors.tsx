import { useEffect, useState } from "react";
import {  Globe, Trash2, ExternalLink, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getMonitors, deleteMonitor } from "@/api/monitorApi";
import type { MonitorResponse } from "@/types/monitor";

export default function Monitors() {
  const [monitors, setMonitors] = useState<MonitorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchMonitors();
  }, []);

  const fetchMonitors = async () => {
    try {
      const response = await getMonitors();
      setMonitors(response.data);
    } catch (error) {
      toast.error("Failed to load monitors");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
  try {
    await deleteMonitor(id);
    setMonitors((prev) => prev.filter((m) => m.id !== id));
    toast.success("Monitor deleted successfully");
  } catch (error) {
    console.log(error);
    toast.error("Failed to delete monitor");
  } finally {
    setDeleteId(null);
  }
};

  if (loading) {
  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-10 w-52 bg-zinc-800 rounded animate-pulse mb-3" />
          <div className="h-4 w-72 bg-zinc-800 rounded animate-pulse" />
        </div>

        <div className="h-12 w-40 bg-zinc-800 rounded-2xl animate-pulse" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <MonitorSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Monitors</h1>
          <p className="mt-2 text-zinc-400">Manage all your monitoring endpoints</p>
        </div>
        <Link
          to="/monitors/create"
          className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 py-3 rounded-2xl transition flex items-center gap-2"
        >
          + New Monitor
        </Link>
      </div>

      {monitors.length === 0 ? (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-16 text-center">
          <Globe size={64} className="mx-auto text-zinc-600 mb-4" />
          <h3 className="text-xl font-semibold">No monitors yet</h3>
          <p className="text-zinc-400 mt-2">Create your first monitor to get started</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {monitors.map((monitor) => (
            <div
              key={monitor.id}
              className="group flex flex-col rounded-3xl border border-zinc-800 bg-zinc-950 p-6 hover:border-emerald-500/30 transition-all h-full min-h-[380px]" // Fixed uniform height
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 flex-1">
                  <Globe className="text-emerald-500" size={26} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-xl line-clamp-1">{monitor.name}</h3>
                    <a
                      href={monitor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1 mt-1 group-hover:underline"
                    >
                      {monitor.url}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 ${
                    monitor.active
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {monitor.active ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>

              {/* Info Section */}
              <div className="mt-6 space-y-3 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">Type:</span>
                  <span className="capitalize font-medium">{monitor.type.toLowerCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">Interval:</span>
                  <span className="font-medium">{monitor.intervalSeconds}s</span>
                </div>

                {monitor.sslDaysRemaining !== null && (
                  <div className="flex items-center gap-2 border border-zinc-800 rounded-2xl px-4 py-2 w-fit">
                    <Shield size={16} />
                    SSL expires in {monitor.sslDaysRemaining} days
                  </div>
                )}
              </div>

              {/* Spacer to push buttons to bottom */}
              <div className="flex-1" />

              {/* Action Buttons - Fixed Position at Bottom */}
              <div className="mt-8 flex gap-3 pt-4 border-t border-zinc-800">
                <Link
                  to={`/monitors/${monitor.id}`}
                  className="flex-1 text-center border border-zinc-700 hover:border-emerald-500 hover:text-emerald-400 py-3 rounded-2xl transition font-medium"
                >
                  View Details
                </Link>

                <a
                  href={monitor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-zinc-700 hover:border-white p-3 rounded-2xl transition flex items-center justify-center"
                  title="Visit URL"
                >
                  <ExternalLink size={20} />
                </a>

                <button
                  onClick={() => setDeleteId(monitor.id)}
                  className="border cursor-pointer border-red-500/30 hover:bg-red-500/10 text-red-400 p-3 rounded-2xl transition"
                  title="Delete Monitor"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {deleteId && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <Trash2 className="text-red-400" size={24} />
        </div>

        <div>
          <h3 className="text-lg font-semibold">Delete Monitor</h3>
          <p className="text-sm text-zinc-400">
            This action cannot be undone.
          </p>
        </div>
      </div>

      <p className="text-zinc-300 mb-6">
        Are you sure you want to permanently delete this monitor?
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => setDeleteId(null)}
          className="flex-1 rounded-2xl border border-zinc-700 py-3 hover:bg-zinc-900 transition"
        >
          Cancel
        </button>

        <button
          onClick={() => handleDelete(deleteId)}
          className="flex-1 rounded-2xl bg-red-500 text-white py-3 hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}


function MonitorSkeleton() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 animate-pulse min-h-[380px]">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex gap-3 flex-1">
          <div className="h-10 w-10 rounded-full bg-zinc-800" />

          <div className="flex-1">
            <div className="h-5 w-40 bg-zinc-800 rounded mb-3" />
            <div className="h-4 w-56 bg-zinc-800 rounded" />
          </div>
        </div>

        <div className="h-7 w-20 bg-zinc-800 rounded-full" />
      </div>

      {/* Info */}
      <div className="mt-6 space-y-4">
        <div className="h-4 w-32 bg-zinc-800 rounded" />
        <div className="h-4 w-24 bg-zinc-800 rounded" />
        <div className="h-10 w-44 bg-zinc-800 rounded-2xl" />
      </div>

      <div className="h-24" />

      {/* Buttons */}
      <div className="border-t border-zinc-800 pt-4 mt-6 flex gap-3">
        <div className="h-12 flex-1 bg-zinc-800 rounded-2xl" />
        <div className="h-12 w-12 bg-zinc-800 rounded-2xl" />
        <div className="h-12 w-12 bg-zinc-800 rounded-2xl" />
      </div>
    </div>
  );
}