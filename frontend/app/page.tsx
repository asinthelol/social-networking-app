"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/shared/store/hooks";
import { getAllPosts, getUserPosts, PostResponse, getUserFriends } from "@/shared/lib/api/";
import { PostCard } from "@/features/profile";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { userId } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<"latest" | "friends">("latest");
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchPosts();
  }, [mounted, activeTab, userId]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (activeTab === "latest") {
        const data = await getAllPosts();
        setPosts(data);
      } else {
        // Friends tab - get posts from friends only
        if (!userId) {
          setPosts([]);
          return;
        }

        // Get user's friends
        const friends = await getUserFriends(userId);
        
        if (friends.length === 0) {
          setPosts([]);
          return;
        }

        // Get posts from all friends
        const friendPosts: PostResponse[] = [];
        for (const friend of friends) {
          const userPosts = await getUserPosts(friend.id);
          friendPosts.push(...userPosts);
        }

        // Sort by created_at descending
        friendPosts.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setPosts(friendPosts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-8">
      <div className="flex flex-col gap-y-4 w-full max-w-[40rem] mx-auto px-4">
        {/* Tab Switcher */}
        <div className="flex gap-2 border-b">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("latest")}
            className={`rounded-none border-b-2 ${
              activeTab === "latest"
                ? "border-primary"
                : "border-transparent"
            }`}
          >
            Latest
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("friends")}
            className={`rounded-none border-b-2 ${
              activeTab === "friends"
                ? "border-primary"
                : "border-transparent"
            }`}
          >
            Friends
          </Button>
        </div>

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

            {posts.length === 0 ? (
              <Card className="p-6">
                <p className="text-muted-foreground text-center py-8">
                  {activeTab === "friends" && !userId
                    ? "Login to see posts from your friends."
                    : activeTab === "friends"
                    ? "No posts from friends yet. Add some friends to see their posts!"
                    : "No posts yet. Be the first to post!"}
                </p>
              </Card>
            ) : (
              <div className="flex flex-col gap-y-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
