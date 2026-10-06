import { ReactNode } from "react";
import { Toaster } from "@/components/atom/toaster";
import "../globals.css";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="flex flex-col min-h-screen animate-in fade-in">
        <main className="flex flex-col grow h-full">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
