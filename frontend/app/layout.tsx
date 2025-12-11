import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/shared/styles/globals.css";
import { ReduxProvider } from "@/shared/components/ReduxProvider";
import { CreatePostButton } from "@/shared/components/CreatePostButton";
import { Navbar } from "@/shared/components/Navbar";
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
            <Navbar />
            {children}
            <CreatePostButton />
            <footer className="flex flex-row items-center justify-center gap-2 py-4 text-sm text-gray-400">
              <span>By Kevin Tolbert</span>
              <a 
                href="https://github.com/asinthelol/social-networking-app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                https://github.com/asinthelol/social-networking-app
              </a>
            </footer>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
