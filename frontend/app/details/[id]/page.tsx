"use client";

import { useParams } from "next/navigation";
import { PostDetails } from "@/features/posts";

export default function PostDetailsPage() {
  const params = useParams();
  const postId = parseInt(params.id as string);

  return <PostDetails postId={postId} />;
}
