import { useEffect, useState } from "react";
import { AlertTriangle, Clock, CheckCircle, ShieldCheck } from "lucide-react";
import { getIncidents } from "@/api/incidentApi";

interface Incident {
  id: string;
  monitorId: string;
  monitorName: string;
  status: "OPEN" | "RESOLVED";
  reason: string;
  startedAt: string;
  resolvedAt: string | null;
}

export default function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const response = await getIncidents();
      setIncidents(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <IncidentsSkeleton />;

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Incidents</h1>
        <p className="mt-2 text-zinc-400">History of service disruptions</p>
      </div>

      {incidents.length === 0 ? (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-12 text-center">
          <AlertTriangle className="mx-auto mb-4 text-zinc-500" size={48} />
          <h3 className="text-xl font-semibold">No incidents recorded</h3>
          <p className="text-zinc-400 mt-2">All your monitors are running smoothly.</p>
        </div>
      ) : (
        <div className="space-y-6">
  {incidents.map((incident) => (
    <div
      key={incident.id}
      className={`rounded-3xl border bg-zinc-950 p-6 transition-all duration-300 ${
        incident.status === "OPEN"
          ? "border-zinc-800 hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/10"
          : "border-zinc-800 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="mt-1">
            {incident.status === "OPEN" ? (
              <div className="rounded-xl bg-red-500/10 p-3">
                <AlertTriangle
                  className="text-red-500"
                  size={22}
                />
              </div>
            ) : (
              <div className="rounded-xl bg-emerald-500/10 p-3">
                <ShieldCheck
                  className="text-emerald-500"
                  size={22}
                />
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {incident.monitorName}
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              {incident.reason}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium ${
            incident.status === "OPEN"
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          }`}
        >
          {incident.status === "OPEN" ? (
            <Clock size={15} />
          ) : (
            <CheckCircle size={15} />
          )}

          {incident.status}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
        <div>
          <span className="mb-1 block text-xs uppercase tracking-widest text-zinc-500">
            Started
          </span>

          <div className="text-zinc-300">
            {formatDate(incident.startedAt)}
          </div>
        </div>

        {incident.resolvedAt && (
          <div>
            <span className="mb-1 block text-xs uppercase tracking-widest text-zinc-500">
              Resolved
            </span>

            <div className="text-emerald-400">
              {formatDate(incident.resolvedAt)}
            </div>
          </div>
        )}
      </div>
    </div>
  ))}
</div>
      )}
    </div>
  );
}

/* Skeleton */
function IncidentsSkeleton() {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-3">
        <div className="h-10 w-64 bg-zinc-800 rounded-xl animate-pulse" />
        <div className="h-4 w-96 bg-zinc-800 rounded-xl animate-pulse" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-52 bg-zinc-800 rounded-3xl animate-pulse" />
      ))}
    </div>
  );
}