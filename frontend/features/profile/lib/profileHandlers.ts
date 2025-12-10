import { uploadProfilePicture, updateUser, deleteUser, getUser } from "@/shared/lib/api/";

export async function handleProfilePictureUpload(
  file: File,
  userId: number,
  onSuccess: () => void,
  onError: (error: string) => void
) {
  try {
    const result = await uploadProfilePicture(file);
    await updateUser(userId, { profile_picture: result.file_url });
    await onSuccess();
  } catch (err) {
    onError(err instanceof Error ? err.message : "Failed to upload profile picture");
  }
}

export async function handleUserUpdate(
  userId: number,
  data: { username: string; email: string; bio: string },
  onSuccess: () => void,
  onError: (error: string) => void
) {
  try {
    await updateUser(userId, data);
    await onSuccess();
  } catch (err) {
    onError(err instanceof Error ? err.message : "Failed to save changes");
  }
}

export async function handleAccountDeletion(
  userId: number,
  currentUserId: number,
  onSuccess: () => void,
  onError: (error: string) => void
) {
  if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    return false;
  }

  try {
    await deleteUser(userId, currentUserId);
    onSuccess();
    return true;
  } catch (err) {
    onError(err instanceof Error ? err.message : "Failed to delete account");
    return false;
  }
}

export async function fetchUserProfile(
  userId: number,
  onSuccess: (data: any) => void,
  onError: (error: string) => void
) {
  try {
    const data = await getUser(userId);
    onSuccess(data);
    return data;
  } catch (err) {
    onError(err instanceof Error ? err.message : "Failed to load user data");
    return null;
  }
}
