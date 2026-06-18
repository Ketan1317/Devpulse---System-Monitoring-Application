import { useState } from "react";
import { registerUser } from "@/api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser(formData);
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      console.error(error);
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
            <h1 className="text-4xl font-bold text-white tracking-tighter">DevPulse</h1>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-10 shadow-2xl">
          <h2 className="text-3xl font-semibold mb-2">Create your account</h2>
          <p className="text-gray-400 mb-8">Start monitoring your services in minutes</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full bg-zinc-950 border border-white/10 focus:border-emerald-500 rounded-2xl px-5 py-4 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-zinc-950 border border-white/10 focus:border-emerald-500 rounded-2xl px-5 py-4 outline-none transition-colors"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-zinc-950 border border-white/10 focus:border-emerald-500 rounded-2xl px-5 py-4 outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-4 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-600/70 text-black font-semibold py-4 rounded-2xl transition-all duration-200"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-400 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Optional footer note */}
        <p className="text-center text-xs text-gray-500 mt-8">
          By creating an account, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
}