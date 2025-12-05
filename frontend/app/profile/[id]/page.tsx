"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { getUser, getUserFriends, addFriend, removeFriend, UserResponse } from "@/shared/lib/api/";
import { useAppSelector } from "@/shared/store/hooks";
import { ProfileTabs, PostsTab, OtherUserHeader, OtherUserFriends } from "@/features/profile";

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id ? parseInt(params.id as string) : null;
  const { userId: currentUserId, isLoggedIn } = useAppSelector((state) => state.auth);
  
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [friends, setFriends] = useState<UserResponse[]>([]);
  const [currentUserFriends, setCurrentUserFriends] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFriendActionLoading, setIsFriendActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"posts" | "friends" | "account">("posts");

  const isFriend = currentUserFriends.some(friend => friend.id === userId);

  useEffect(() => {
    if (!userId || (currentUserId && userId === currentUserId)) {
      router.push(userId ? "/profile" : "/");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [userRes, friendsRes, currentFriendsRes] = await Promise.all([
          getUser(userId),
          getUserFriends(userId),
          currentUserId ? getUserFriends(currentUserId) : Promise.resolve([]),
        ]);
        setUserData(userRes);
        setFriends(friendsRes);
        setCurrentUserFriends(currentFriendsRes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, currentUserId, router]);

  const handleFriendAction = async (action: "add" | "remove") => {
    if (!currentUserId || !userId) return;
    if (action === "remove" && !confirm("Are you sure you want to remove this friend?")) return;

    try {
      setIsFriendActionLoading(true);
      await (action === "add" ? addFriend(currentUserId, userId) : removeFriend(currentUserId, userId));
      const updatedFriends = await getUserFriends(currentUserId);
      setCurrentUserFriends(updatedFriends);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} friend`);
    } finally {
      setIsFriendActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <p className="text-center text-muted-foreground">User not found</p>
          <Button onClick={() => router.back()} className="w-full mt-4">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-8">
      <div className="flex flex-col gap-y-4 w-full max-w-[40rem] mx-auto px-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="self-start">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <OtherUserHeader
          userData={userData}
          isFriend={isFriend}
          isLoggedIn={isLoggedIn}
          isFriendActionLoading={isFriendActionLoading}
          error={error}
          onAddFriend={() => handleFriendAction("add")}
          onRemoveFriend={() => handleFriendAction("remove")}
        />

        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "posts" && userId && <PostsTab userId={userId} username={userData.username} />}
        {activeTab === "friends" && <OtherUserFriends friends={friends} />}
      </div>
    </div>
  );
}
