import { useRouter } from "next/navigation";
import { Card } from "@/shared/components/ui/card";
import { PostResponse } from "@/shared/lib/api/";
import { BACKEND_URL } from "@/shared/lib/api/config";

interface PostDisplayProps {
  post: PostResponse;
  formatDate: (dateString: string) => string;
}

export function PostDisplay({ post, formatDate }: PostDisplayProps) {
  const router = useRouter();

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <button
          onClick={() => router.push(`/profile/${post.user_id}`)}
          className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0 hover:opacity-80 transition-opacity"
        >
          {post.author.profile_picture && (
            <img
              src={`${BACKEND_URL}${post.author.profile_picture}`}
              alt={post.author.username}
              className="w-full h-full object-cover"
            />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="mb-1">
            <button
              onClick={() => router.push(`/profile/${post.user_id}`)}
              className="font-semibold hover:underline"
            >
              {post.author.username}
            </button>
            <p className="text-xs text-muted-foreground">
              {formatDate(post.created_at)}
            </p>
          </div>

          <p className="text-sm whitespace-pre-wrap wrap-break-word mb-3">
            {post.content}
          </p>

          {post.image_url && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={`${BACKEND_URL}${post.image_url}`}
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
