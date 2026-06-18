import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Brain,
  Monitor,
  PlusCircle,
  AlertTriangle,
  Activity,
  Settings,
  LogOut,
  HeartPulse,
} from "lucide-react";

import { useAuth } from "@/context/authContext";

const navItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "AI Insights",
    path: "/ai-insights",
    icon: Brain,
  },
  {
    title: "Monitors",
    path: "/monitors",
    icon: Monitor,
  },
  {
    title: "Create Monitor",
    path: "/monitors/create",
    icon: PlusCircle,
  },
  {
    title: "Incidents",
    path: "/incidents",
    icon: AlertTriangle,
  },
  {
    title: "Monitor Checks",
    path: "/monitor-checks",
    icon: Activity,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-zinc-800 bg-zinc-950">
      {/* Logo */}
      <div className="border-b border-zinc-800 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500">
            <HeartPulse
              size={24}
              className="text-black"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">
              DevPulse
            </h1>

            <p className="text-xs text-zinc-500">
              Monitoring Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`
                }
              >
                <Icon
                  size={18}
                  className="transition-transform duration-200 group-hover:scale-110"
                />

                <span className="font-medium">
                  {item.title}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-800 p-4">
        <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-xs text-emerald-400">
              Monitoring Active
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3
          cursor-pointer rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut size={18} />

          <span className="font-medium">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}