import { Card } from "@/shared/components/ui/card";

interface ProfileTabsProps {
  activeTab: "posts" | "friends" | "account";
  onTabChange: (tab: "posts" | "friends" | "account") => void;
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <Card className="flex flex-row mb-6 p-1 bg-muted/50">
      <button
        onClick={() => onTabChange("posts")}
        className={`flex-1 px-4 py-2 font-medium transition-all rounded ${
          activeTab === "posts"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Posts
      </button>
      <button
        onClick={() => onTabChange("friends")}
        className={`flex-1 px-4 py-2 font-medium transition-all rounded ${
          activeTab === "friends"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Friends
      </button>
      <button
        onClick={() => onTabChange("account")}
        className={`flex-1 px-4 py-2 font-medium transition-all rounded ${
          activeTab === "account"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Account
      </button>
    </Card>
  );
}
