"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/store/hooks";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { User, Search } from "lucide-react";
import { useState, useEffect  } from "react";

export function Navbar() {
  const router = useRouter();
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };

  return (
    <nav className="border-b bg-card sticky top-0 z-50">
      <div className="w-full max-w-full px-4 h-16 flex items-center justify-between gap-4">
        
        <button
          onClick={() => router.push("/")}
          className="text-xl font-bold hover:opacity-80 transition-opacity"
        >
          Zephyr
        </button>

        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </form>

        {mounted && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleProfileClick}
            className="gap-2"
          >
            <User className="w-4 h-4" />
            {isLoggedIn ? "Profile" : "Login"}
          </Button>
        )}
      </div>
    </nav>
  );
}
