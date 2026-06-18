import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Navbar />

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}