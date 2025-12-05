"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/shared/components/ui/card";
import { Loader2 } from "lucide-react";
import { UserResponse } from "@/shared/lib/api/";
import { BACKEND_URL } from "@/shared/lib/api/config";

interface UserSearchProps {
  query: string;
}

export function UserSearch({ query }: UserSearchProps) {
  const router = useRouter();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (query) {
      searchUsers();
    } else {
      setUsers([]);
      setIsLoading(false);
    }
  }, [mounted, query]);

  const searchUsers = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Fetch all users and filter by username
      const response = await fetch(`${BACKEND_URL}/api/users/`);
      if (!response.ok) {
        throw new Error("Failed to search users");
      }
      
      const allUsers: UserResponse[] = await response.json();
      const filteredUsers = allUsers.filter((user) =>
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      
      setUsers(filteredUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search users");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleUserClick = (userId: number) => {
    router.push(`/profile/${userId}`);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-8">
      <div className="flex flex-col gap-y-4 w-full max-w-[40rem] mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">
          {query ? `Search results for "${query}"` : "Search"}
        </h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            {!query ? (
              <Card className="p-6">
                <p className="text-muted-foreground text-center py-8">
                  Enter a username in the search bar to find users.
                </p>
              </Card>
            ) : users.length === 0 ? (
              <Card className="p-6">
                <p className="text-muted-foreground text-center py-8">
                  No users found matching "{query}".
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <Card
                    key={user.id}
                    className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex-shrink-0">
                        {user.profile_picture && (
                          <img
                            src={`${BACKEND_URL}${user.profile_picture}`}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{user.username}</h3>
                        <p className="text-xs text-muted-foreground">
                          Joined {formatDate(user.created_at)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
