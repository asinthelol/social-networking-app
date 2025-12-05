import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/shared/styles/globals.css";
import { ReduxProvider } from "@/shared/components/ReduxProvider";
import { CreatePostButton } from "@/shared/components/CreatePostButton";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Social Network",
  description: "A simple social networking application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ReduxProvider>
            {children}
            <CreatePostButton />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
