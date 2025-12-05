"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/store/hooks";
import {
  getPost,
  PostResponse,
  getPostComments,
  createComment,
  deleteComment,
  CommentResponse,
} from "@/shared/lib/api/";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { PostDisplay } from "./PostDisplay";
import { CommentForm } from "./CommentForm";
import { CommentsList } from "./CommentsList";

interface PostDetailsProps {
  postId: number;
}

export function PostDetails({ postId }: PostDetailsProps) {
  const router = useRouter();
  const { userId } = useAppSelector((state) => state.auth);

  const [post, setPost] = useState<PostResponse | null>(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Comment form state
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchPostAndComments();
  }, [mounted, postId]);

  const fetchPostAndComments = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [postData, commentsData] = await Promise.all([
        getPost(postId),
        getPostComments(postId),
      ]);

      setPost(postData);
      setComments(commentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !commentText.trim()) return;

    try {
      setIsSubmitting(true);
      const newComment = await createComment({
        content: commentText.trim(),
        user_id: userId,
        post_id: postId,
      });

      setComments([...comments, newComment]);
      setCommentText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      setDeletingCommentId(commentId);
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <p className="text-muted-foreground">Post not found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-8">
      <div className="flex flex-col gap-y-4 w-full max-w-[40rem] mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="w-fit gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <PostDisplay post={post} formatDate={formatDate} />

        <div className="flex flex-col gap-y-4">
          <h2 className="text-xl font-bold">
            Comments ({comments.length})
          </h2>

          {userId && (
            <CommentForm
              commentText={commentText}
              isSubmitting={isSubmitting}
              onCommentChange={setCommentText}
              onSubmit={handleSubmitComment}
            />
          )}

          <CommentsList
            comments={comments}
            userId={userId}
            deletingCommentId={deletingCommentId}
            error={error}
            formatDate={formatDate}
            onDeleteComment={handleDeleteComment}
          />
        </div>
      </div>
    </div>
  );
}
