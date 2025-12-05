"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { User, UserMinus, Loader2 } from "lucide-react";
import { getUserFriends, removeFriend, UserResponse } from "@/shared/lib/api/";
import { BACKEND_URL } from "@/shared/lib/api/config";

interface FriendsTabProps {
  userId: number;
}

export function FriendsTab({ userId }: FriendsTabProps) {
  const router = useRouter();
  const [friends, setFriends] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingFriendId, setRemovingFriendId] = useState<number | null>(null);

  useEffect(() => {
    fetchFriends();
  }, [userId]);

  const fetchFriends = async () => {
    try {
      setIsLoading(true);
      const data = await getUserFriends(userId);
      setFriends(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load friends");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFriend = async (friendId: number) => {
    if (!confirm("Are you sure you want to remove this friend?")) {
      return;
    }

    try {
      setRemovingFriendId(friendId);
      await removeFriend(userId, friendId);
      setFriends(friends.filter(friend => friend.id !== friendId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove friend");
    } finally {
      setRemovingFriendId(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Friends ({friends.length})</h2>
      
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {friends.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No friends yet.</p>
      ) : (
        <div className="space-y-3">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div 
                className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
                onClick={() => router.push(`/profile/${friend.id}`)}
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
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
                  {friend.bio && (
                    <p className="text-sm text-muted-foreground truncate mt-1">{friend.bio}</p>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFriend(friend.id);
                }}
                disabled={removingFriendId === friend.id}
                className="flex-shrink-0"
              >
                {removingFriendId === friend.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <UserMinus className="w-4 h-4 mr-2" />
                    Remove
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
