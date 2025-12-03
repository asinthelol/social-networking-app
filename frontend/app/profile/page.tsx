"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/shared/store/hooks";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { User, LogOut } from "lucide-react";
import { getUser, updateUser, deleteUser, uploadProfilePicture, UserResponse } from "@/shared/lib/api/";
import { logout } from "@/shared/store/authSlice";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoggedIn, userId } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<"posts" | "account">("posts");
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    // Fetch user data
    if (userId) {
      fetchUserData();
    }
  }, [isLoggedIn, userId, router]);

  const fetchUserData = async () => {
    if (!userId) return;

    try {
      const data = await getUser(userId);
      setUserData(data);
      setFormData({
        username: data.username,
        email: data.email,
        bio: data.bio || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user data");
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsLoading(true);
        const result = await uploadProfilePicture(file);
        
        // Update user with new profile picture URL
        if (userId) {
          await updateUser(userId, { profile_picture: result.file_url });
          await fetchUserData();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload profile picture");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setIsLoading(true);
      setError("");
      await updateUser(userId, {
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
      });
      await fetchUserData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) return;
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteUser(userId);
      dispatch(logout());
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account");
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-8">
      <div className="flex flex-col gap-y-4 w-full max-w-[40rem] mx-auto px-4">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Profile Picture */}
            <div 
              className="relative cursor-pointer group"
              onClick={handleProfilePictureClick}
            >
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {userData?.profile_picture ? (
                  <img src={`http://127.0.0.1:8000${userData.profile_picture}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-medium">Change</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{userData?.username || "User"}</h1>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{userData?.email}</p>
              <p className="text-sm text-muted-foreground">{userData?.bio || "No bio yet"}</p>
            </div>

            {/* Logout Button */}
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </Card>

        {/* Tabs */}
        <Card className="flex flex-row mb-6 p-1 bg-muted/50">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 px-4 py-2 font-medium transition-all rounded ${
              activeTab === "posts"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`flex-1 px-4 py-2 font-medium transition-all rounded ${
              activeTab === "account"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Account
          </button>
        </Card>

        {/* Tab Content */}
        {activeTab === "posts" && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
            <p className="text-muted-foreground">No posts yet.</p>
          </Card>
        )}

        {activeTab === "account" && (
          <div className="flex flex-col gap-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
              <p className="text-sm text-muted-foreground mb-6">Manage your account information.</p>
              
              <form onSubmit={handleSaveChanges} className="flex flex-col gap-y-6">
                {error && (
                  <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                    {error}
                  </div>
                )}
                
                <div className="flex flex-col gap-y-2">
                  <label htmlFor="username" className="font-semibold">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="flex flex-col gap-y-2">
                  <label htmlFor="email" className="font-semibold">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="flex flex-col gap-y-2">
                  <label htmlFor="bio" className="font-semibold">Bio</label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Card>

            <Card className="p-6 border-destructive">
              <h2 className="text-xl font-semibold text-destructive mb-2">Danger Zone</h2>
              <p className="text-sm text-muted-foreground mb-6">Irreversible and destructive actions</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleDeleteAccount} disabled={isLoading}>
                  {isLoading ? "Deleting..." : "Delete Account"}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
