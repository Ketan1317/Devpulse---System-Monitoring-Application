import { Routes, Route, Navigate } from "react-router-dom"

import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Dashboard from "@/pages/Dashboard"
import AIInsights from "@/pages/AIInsights"
import Monitors from "@/pages/Monitors"
import CreateMonitor from "@/pages/CreateMonitor"
import Incidents from "@/pages/Incidents"
import MonitorChecks from "@/pages/MonitorChecks"
import Settings from "@/pages/Settings"

import ProtectedRoute from "@/routes/ProtectedRoute"
import DashboardLayout from "./components/DashboardLayout"
import MonitorDetails from "./pages/MonitorDetails"

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/monitors" element={<Monitors />} />
            <Route path="/monitors/:id" element={<MonitorDetails />} />
            <Route path="/monitors/create" element={<CreateMonitor />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/monitor-checks" element={<MonitorChecks />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center">
              <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </div>
  )
}

export default App
