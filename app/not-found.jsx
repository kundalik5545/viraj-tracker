"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <div className="space-y-2">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Page Not Found</h1>
          <p className="text-muted-foreground text-lg">
            Oops! It seems like the page you&apos;re looking for doesn&apos;t
            exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="default" size="lg" asChild className="min-w-[200px]">
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Go to Dashboard
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="min-w-[200px]"
          >
            Go Back
          </Button>
        </div>
        <div className="pt-6">
          <p className="text-sm text-muted-foreground">
            If you believe this is a mistake, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
