"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/shared/store/hooks";
import { UserResponse } from "@/shared/lib/api/";
import { logout } from "@/shared/store/authSlice";
import { ProfileHeader, ProfileTabs, PostsTab, FriendsTab, AccountTab } from "@/features/profile";
import {
  fetchUserProfile,
  handleProfilePictureUpload,
  handleUserUpdate,
  handleAccountDeletion,
} from "@/features/profile/lib";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoggedIn, userId } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<"posts" | "friends" | "account">("posts");
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (userId) {
      fetchUserData();
    }
  }, [mounted, isLoggedIn, userId, router]);

  const fetchUserData = async () => {
    if (!userId) return;

    await fetchUserProfile(
      userId,
      (data) => {
        setUserData(data);
        setFormData({
          username: data.username,
          email: data.email,
          bio: data.bio || "",
        });
      },
      setError
    );
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setIsLoading(true);
    await handleProfilePictureUpload(file, userId, fetchUserData, setError);
    setIsLoading(false);
  };

  const handleFormChange = (field: "username" | "email" | "bio", value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsLoading(true);
    setError("");
    await handleUserUpdate(userId, formData, fetchUserData, setError);
    setIsLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!userId) return;

    setIsLoading(true);
    const success = await handleAccountDeletion(
      userId,
      userId,
      () => {
        dispatch(logout());
        router.push("/login");
      },
      setError
    );
    if (!success) {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

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

        {activeTab === "posts" && userId && <PostsTab userId={userId} />}

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
