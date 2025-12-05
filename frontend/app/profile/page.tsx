"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/shared/store/hooks";
import { getUser, updateUser, deleteUser, uploadProfilePicture, UserResponse } from "@/shared/lib/api/";
import { logout } from "@/shared/store/authSlice";
import { ProfileHeader, ProfileTabs, PostsTab, FriendsTab, AccountTab } from "@/features/profile";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoggedIn, userId } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<"posts" | "friends" | "account">("posts");
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsLoading(true);
        const result = await uploadProfilePicture(file);
        
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

  const handleFormChange = (field: "username" | "email" | "bio", value: string) => {
    setFormData({ ...formData, [field]: value });
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
        <ProfileHeader
          userData={userData}
          onProfilePictureChange={handleProfilePictureChange}
          onLogout={handleLogout}
        />

        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "posts" && <PostsTab />}

        {activeTab === "friends" && userId && <FriendsTab userId={userId} />}

        {activeTab === "account" && (
          <AccountTab
            formData={formData}
            error={error}
            isLoading={isLoading}
            onFormChange={handleFormChange}
            onSaveChanges={handleSaveChanges}
            onDeleteAccount={handleDeleteAccount}
          />
        )}
      </div>
    </div>
  );
}
