"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "@/lib/firebase/firebase-auth";

export default function AuthGate({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Navigate to home if authenticated
    if (user && (pathname === "/auth/login" || pathname === "/auth/sign-up")) {
      router.push("/");
    }

    // Navigate to login if not authenticated
    if (!user && pathname !== "/auth/login" && pathname !== "/auth/sign-up") {
      router.push("/auth/login");
    }
  }, [user, loading, router, pathname]);

  if (
    loading ||
    (user && (pathname === "/auth/login" || pathname === "/auth/sign-up"))
  ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="animate-spin size-10" />
      </div>
    );
  }

  return <>{children}</>;
}
