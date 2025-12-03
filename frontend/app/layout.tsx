import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/shared/styles/globals.css";
import { ReduxProvider } from "@/shared/components/ReduxProvider";

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
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased`}
      >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
