import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Frown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#C4E1E1] via-white to-[#C4E1E1]/50 px-4">
      <div className="text-center max-w-md">
        <Frown className="mx-auto h-16 w-16 text-[#4B6B6B]" />
        <h1 className="mt-4 text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mt-2 text-xl font-semibold text-gray-700">
          Page Not Found
        </h2>
        <p className="mt-3 text-gray-600">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/">
            <Button
              className="bg-[#4B6B6B] hover:bg-[#3b5656] text-white"
            >
              Go Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="border-[#4B6B6B] text-[#4B6B6B] hover:bg-[#C4E1E1]/30">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
