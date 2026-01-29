import { useRouter } from "next/navigation";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { CommentResponse } from "@/shared/lib/api/";
import { BACKEND_URL } from "@/shared/lib/api/config";

interface CommentItemProps {
  comment: CommentResponse;
  userId: number | null;
  deletingCommentId: number | null;
  formatDate: (dateString: string) => string;
  onDelete: (commentId: number) => void;
}

export function CommentItem({ 
  comment, 
  userId, 
  deletingCommentId, 
  formatDate, 
  onDelete 
}: CommentItemProps) {
  const router = useRouter();

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <button
          onClick={() => router.push(`/profile/${comment.user_id}`)}
          className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0 hover:opacity-80 transition-opacity"
        >
          {comment.author?.profile_picture && (
            <img
              src={`${BACKEND_URL}${comment.author.profile_picture}`}
              alt={comment.author.username}
              className="w-full h-full object-cover"
            />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div>
              <button
                onClick={() => router.push(`/profile/${comment.user_id}`)}
                className="font-semibold text-sm hover:underline"
              >
                {comment.author?.username || "Unknown User"}
              </button>
              <p className="text-xs text-muted-foreground">
                {formatDate(comment.created_at)}
              </p>
            </div>
            {userId === comment.user_id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(comment.id)}
                disabled={deletingCommentId === comment.id}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                {deletingCommentId === comment.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
          <p className="text-sm whitespace-pre-wrap wrap-break-word">
            {comment.content}
          </p>
        </div>
      </div>
    </Card>
  );
}
