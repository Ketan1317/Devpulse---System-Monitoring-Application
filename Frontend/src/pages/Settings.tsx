import { useEffect, useState } from "react";
import { User, Mail, Calendar, Shield, Moon, Sun, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { getProfile } from "@/api/userProfile";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  active: boolean;
  createdAt: string;
}

export default function Settings() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true); // Default dark

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch (error) {
        console.log(error)
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Dark/Light Mode Toggle
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    toast.success(`${newTheme ? 'Dark' : 'Light'} mode enabled`);
  };

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return <div className="text-red-500 p-8">Failed to load profile</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Profile</h1>
        <p className="text-zinc-400 mt-2">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center overflow-hidden">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={64} className="text-black" />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-semibold">{profile.fullName}</h2>
              <div className="flex items-center gap-2 text-zinc-400 mt-1">
                <Mail size={18} />
                <span>{profile.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 bg-zinc-900 rounded-2xl p-4">
                <Shield className="text-emerald-500" size={24} />
                <div>
                  <p className="text-sm text-zinc-500">Status</p>
                  <p className={`font-medium ${profile.active ? "text-emerald-400" : "text-red-400"}`}>
                    {profile.active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-zinc-900 rounded-2xl p-4">
                <Calendar className="text-zinc-400" size={24} />
                <div>
                  <p className="text-sm text-zinc-500">Member Since</p>
                  <p className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
        <h3 className="text-xl font-semibold mb-6">Preferences</h3>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl">
            <div className="flex items-center gap-4">
              {isDark ? <Moon size={24} /> : <Sun size={24} />}
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-zinc-500">Switch between dark and light mode</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="bg-zinc-800 hover:bg-zinc-700 px-5 py-2.5 rounded-xl transition flex items-center gap-2"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          {/* Other Settings (Future expandable) */}
          <div className="p-4 bg-zinc-900 rounded-2xl text-zinc-400">
            More settings coming soon: Notifications, Password change, API Keys, etc.
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-3xl border border-red-900/30 bg-zinc-950 p-8">
        <h3 className="text-red-400 font-semibold mb-4">Danger Zone</h3>
        <button
          onClick={logout}
          className="flex items-center cursor-pointer gap-3 text-red-400 hover:text-red-500 transition px-6 py-3 border border-red-500/30 hover:border-red-500 rounded-2xl"
        >
          <LogOut size={20} />
          Logout from DevPulse
        </button>
      </div>
    </div>
  );
}

/* Skeleton */
function ProfileSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="h-10 w-64 bg-zinc-800 rounded-xl animate-pulse" />
      <div className="h-80 bg-zinc-800 rounded-3xl animate-pulse" />
      <div className="h-64 bg-zinc-800 rounded-3xl animate-pulse" />
    </div>
  );
}