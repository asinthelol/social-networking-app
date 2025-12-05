"use client";

import { useSearchParams } from "next/navigation";
import { UserSearch } from "@/features/search";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return <UserSearch query={query} />;
}
