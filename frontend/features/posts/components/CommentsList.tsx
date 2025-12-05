import { Card } from "@/shared/components/ui/card";
import { CommentResponse } from "@/shared/lib/api/";
import { CommentItem } from "./CommentItem";

interface CommentsListProps {
  comments: CommentResponse[];
  userId: number | null;
  deletingCommentId: number | null;
  error: string;
  formatDate: (dateString: string) => string;
  onDeleteComment: (commentId: number) => void;
}

export function CommentsList({ 
  comments, 
  userId, 
  deletingCommentId, 
  error, 
  formatDate, 
  onDeleteComment 
}: CommentsListProps) {
  return (
    <>
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      {comments.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              userId={userId}
              deletingCommentId={deletingCommentId}
              formatDate={formatDate}
              onDelete={onDeleteComment}
            />
          ))}
        </div>
      )}
    </>
  );
}
