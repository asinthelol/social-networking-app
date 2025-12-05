import { Card } from "@/shared/components/ui/card";

export function PostsTab() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
      <p className="text-muted-foreground">No posts yet.</p>
    </Card>
  );
}
