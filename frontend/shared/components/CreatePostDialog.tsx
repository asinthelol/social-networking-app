"use client";

import { useState, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { Plus, Image as ImageIcon, Smile, Loader2, X } from "lucide-react";
import { createPost, uploadPostImage } from "@/shared/lib/api/";
import { useAppSelector } from "@/shared/store/hooks";

interface CreatePostDialogProps {
  onPostCreated?: () => void;
}

export function CreatePostDialog({ onPostCreated }: CreatePostDialogProps) {
  const { userId, isLoggedIn } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxChars = 280;
  const remainingChars = maxChars - content.length;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePost = async () => {
    if (!userId || !content.trim()) return;

    try {
      setIsLoading(true);
      setError("");

      let imageUrl: string | undefined;

      if (imageFile) {
        const uploadResult = await uploadPostImage(imageFile);
        imageUrl = uploadResult.file_url;
      }

      await createPost({
        content: content.trim(),
        image_url: imageUrl,
        user_id: userId,
      });

      setContent("");
      setImageFile(null);
      setImagePreview(null);
      setOpen(false);
      onPostCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      setError("");
    }
    setOpen(newOpen);
  };

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-40"
        aria-label="Create post"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-y-4">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-y-2">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, maxChars))}
                placeholder="What's on your mind?"
                className="min-h-[120px] resize-none"
                disabled={isLoading}
              />
              <div className={`text-sm text-right ${remainingChars < 20 ? "text-destructive" : "text-muted-foreground"}`}>
                {remainingChars} characters remaining
              </div>
            </div>

            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-md"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Image
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled
                    title="Coming soon"
                  >
                    <Smile className="w-4 h-4 mr-2" />
                    Emoji
                  </Button>
                </div>

                <Button
                  onClick={handlePost}
                  disabled={!content.trim() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post"
                  )}
                </Button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
