"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UserSearch } from "@/features/search";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return <UserSearch query={query} />;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
