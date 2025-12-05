"use client";

import { useEffect, useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { Loader2 } from "lucide-react";
import { getUserPosts, deletePost, PostResponse } from "@/shared/lib/api/";
import { PostCard } from "./PostCard";

interface PostsTabProps {
  userId: number;
  username?: string;
}

export function PostsTab({ userId, username }: PostsTabProps) {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const data = await getUserPosts(userId);
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      setDeletingPostId(postId);
      await deletePost(postId);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
    } finally {
      setDeletingPostId(null);
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
    <div className="flex flex-col gap-y-4">
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground text-center py-8">
            {username ? `${username} hasn't posted yet.` : "No posts yet."}
          </p>
        </Card>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDelete={handleDeletePost}
            isDeleting={deletingPostId === post.id}
          />
        ))
      )}
    </div>
  );
}
