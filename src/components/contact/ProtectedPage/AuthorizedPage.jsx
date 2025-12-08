"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/utils/auth";

export default function ProtectedPage({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Try to fetch user details using the cookie
        await authAPI.getMe();
        setIsAuthenticated(true);
      } catch (error) {
        // Suppress 401 Unauthorized errors as they are expected when not logged in
        if (error.response && error.response.status !== 401) {
          console.error("Auth check failed", error);
        }
        setIsAuthenticated(false);
        router.replace("/login");
      }
    };

    verifyAuth();
  }, [router]);

  if (isAuthenticated === null) {
    // still checking auth, maybe show a spinner?
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    // user is redirected, still don't render the page
    return null;
  }

  // user is authenticated, render the protected page
  return <>{children}</>;
}
