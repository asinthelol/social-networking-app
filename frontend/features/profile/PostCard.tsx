"use client";

import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { User, Trash2, Loader2 } from "lucide-react";
import { PostResponse } from "@/shared/lib/api/";
import { useAppSelector } from "@/shared/store/hooks";

interface PostCardProps {
  post: PostResponse;
  onDelete?: (postId: number) => void;
  isDeleting?: boolean;
}

export function PostCard({ post, onDelete, isDeleting }: PostCardProps) {
  const { userId } = useAppSelector((state) => state.auth);
  const isOwner = userId === post.user_id;
  const createdAt = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Safety check for author data
  if (!post.author) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
          {post.author.profile_picture ? (
            <img
              src={`http://127.0.0.1:8000${post.author.profile_picture}`}
              alt={post.author.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="font-semibold">{post.author.username}</h3>
              <p className="text-xs text-muted-foreground">{createdAt}</p>
            </div>
            {isOwner && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(post.id)}
                disabled={isDeleting}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>

          <p className="text-sm whitespace-pre-wrap break-words mb-3">{post.content}</p>

          {post.image_url && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={`http://127.0.0.1:8000${post.image_url}`}
                alt="Post image"
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
