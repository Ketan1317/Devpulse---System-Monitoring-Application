// pages/Login.tsx
import { useState } from "react";
import { loginUser } from "@/api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await loginUser(formData);
      login(data);
      toast.success("Welcome back to DevPulse");
      navigate("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <span className="text-3xl font-bold text-black">D</span>
            </div>
            <h1 className="text-4xl font-bold text-white">DevPulse</h1>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-10 shadow-2xl">
          <h2 className="text-3xl font-semibold mb-2">Welcome back</h2>
          <p className="text-gray-400 mb-8">Sign in to monitor your services</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-zinc-950 border border-white/10 focus:border-emerald-500 rounded-2xl px-5 py-4 outline-none transition-colors"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-zinc-950 border border-white/10 focus:border-emerald-500 rounded-2xl px-5 py-4 outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-4 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-4 rounded-2xl transition-all disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-emerald-400 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}