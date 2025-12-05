"use client";

import dynamic from "next/dynamic";

const CreatePostDialog = dynamic(
  () => import("@/shared/components/CreatePostDialog").then((mod) => mod.CreatePostDialog),
  { ssr: false }
);

export function CreatePostButton() {
  return <CreatePostDialog />;
}
