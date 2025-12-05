"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useAppDispatch } from "@/shared/store/hooks";
import { login } from "@/shared/store/authSlice";
import { getUserByUsername } from "@/shared/lib/api/";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;

    try {
      const user = await getUserByUsername(username);
      
      if (!user) {
        setError("User not found. Please check your username or register.");
        setIsLoading(false);
        return;
      }

      dispatch(login({ userId: user.id, username: user.username }));
      
      setTimeout(() => {
        router.push("/profile");
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="rounded border-gray-300"
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Note: Authentication is not required for this project
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
