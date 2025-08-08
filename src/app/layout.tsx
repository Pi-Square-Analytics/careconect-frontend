import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/lib/api/auth';

export const metadata: Metadata = {
  title: "CareConnect - Healthcare Management System",
  description: "A comprehensive healthcare management platform connecting patients, doctors, and administrators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}