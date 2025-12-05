import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

interface AccountFormData {
  username: string;
  email: string;
  bio: string;
}

interface AccountTabProps {
  formData: AccountFormData;
  error: string;
  isLoading: boolean;
  onFormChange: (field: keyof AccountFormData, value: string) => void;
  onSaveChanges: (e: React.FormEvent) => void;
  onDeleteAccount: () => void;
}

export function AccountTab({ 
  formData, 
  error, 
  isLoading, 
  onFormChange, 
  onSaveChanges, 
  onDeleteAccount 
}: AccountTabProps) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
        <p className="text-sm text-muted-foreground mb-6">Manage your account information.</p>
        
        <form onSubmit={onSaveChanges} className="flex flex-col gap-y-6">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex flex-col gap-y-2">
            <label htmlFor="username" className="font-semibold">Username</label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => onFormChange("username", e.target.value)}
              className="px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="email" className="font-semibold">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onFormChange("email", e.target.value)}
              className="px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="bio" className="font-semibold">Bio</label>
            <textarea
              id="bio"
              rows={4}
              value={formData.bio}
              onChange={(e) => onFormChange("bio", e.target.value)}
              className="px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>

      <Card className="p-6 border-destructive">
        <h2 className="text-xl font-semibold text-destructive mb-2">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-6">Irreversible and destructive actions</p>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Delete Account</h3>
            <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
          </div>
          <Button variant="destructive" size="sm" onClick={onDeleteAccount} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
