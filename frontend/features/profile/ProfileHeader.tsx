"use client";

import { useRef } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { User, LogOut } from "lucide-react";
import { UserResponse } from "@/shared/lib/api";

interface ProfileHeaderProps {
  userData: UserResponse | null;
  onProfilePictureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogout: () => void;
}

export function ProfileHeader({ userData, onProfilePictureChange, onLogout }: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-start gap-6">
        {/* Profile Picture */}
        <div 
          className="relative cursor-pointer group"
          onClick={handleProfilePictureClick}
        >
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {userData?.profile_picture ? (
              <img src={`http://127.0.0.1:8000${userData.profile_picture}`} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-muted-foreground" />
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs font-medium">Change</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onProfilePictureChange}
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{userData?.username || "User"}</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{userData?.email}</p>
          <p className="text-sm text-muted-foreground">{userData?.bio || "No bio yet"}</p>
        </div>

        {/* Logout Button */}
        <Button variant="outline" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </Card>
  );
}
