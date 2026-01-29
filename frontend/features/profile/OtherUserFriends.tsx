"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/shared/components/ui/card";
import { User } from "lucide-react";
import { UserResponse } from "@/shared/lib/api";
import { BACKEND_URL } from "@/shared/lib/api/config";

interface OtherUserFriendsProps {
  friends: UserResponse[];
}

export function OtherUserFriends({ friends }: OtherUserFriendsProps) {
  const router = useRouter();

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Friends ({friends.length})</h2>

      {friends.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No friends yet.</p>
      ) : (
        <div className="space-y-3">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              onClick={() => router.push(`/profile/${friend.id}`)}
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {friend.profile_picture ? (
                  <img
                    src={`${BACKEND_URL}${friend.profile_picture}`}
                    alt={friend.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{friend.username}</h3>
                <p className="text-sm text-muted-foreground truncate">{friend.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
