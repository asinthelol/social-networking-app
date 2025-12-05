"use client";

import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { UserResponse } from "@/shared/lib/api";
import { BACKEND_URL } from "@/shared/lib/api/config";

interface OtherUserHeaderProps {
  userData: UserResponse;
  isFriend: boolean;
  isLoggedIn: boolean;
  isFriendActionLoading: boolean;
  error: string;
  onAddFriend: () => void;
  onRemoveFriend: () => void;
}

export function OtherUserHeader({
  userData,
  isFriend,
  isLoggedIn,
  isFriendActionLoading,
  error,
  onAddFriend,
  onRemoveFriend,
}: OtherUserHeaderProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-muted overflow-hidden flex-shrink-0">
          {userData.profile_picture && (
            <img
              src={`${BACKEND_URL}${userData.profile_picture}`}
              alt={userData.username}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold mb-2">{userData.username}</h1>
          <p className="text-sm text-muted-foreground mb-1">{userData.email}</p>
          {userData.bio && (
            <p className="text-sm text-muted-foreground mt-2">{userData.bio}</p>
          )}
        </div>

        {isLoggedIn && (
          <div className="flex-shrink-0">
            {isFriend ? (
              <Button
                variant="outline"
                onClick={onRemoveFriend}
                disabled={isFriendActionLoading}
              >
                {isFriendActionLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <UserMinus className="w-4 h-4 mr-2" />
                )}
                Remove Friend
              </Button>
            ) : (
              <Button onClick={onAddFriend} disabled={isFriendActionLoading}>
                {isFriendActionLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                Add Friend
              </Button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mt-4">
          {error}
        </div>
      )}
    </Card>
  );
}
