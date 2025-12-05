import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface CommentFormProps {
  commentText: string;
  isSubmitting: boolean;
  onCommentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CommentForm({ 
  commentText, 
  isSubmitting, 
  onCommentChange, 
  onSubmit 
}: CommentFormProps) {
  return (
    <Card className="p-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-y-3">
        <Textarea
          value={commentText}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Write a comment..."
          className="resize-none"
          rows={3}
        />
        <Button
          type="submit"
          disabled={isSubmitting || !commentText.trim()}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Posting...
            </>
          ) : (
            "Post Comment"
          )}
        </Button>
      </form>
    </Card>
  );
}
