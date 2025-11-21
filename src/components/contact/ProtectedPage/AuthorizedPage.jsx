"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedPage({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking

  useEffect(() => {
    const token = localStorage.getItem("access"); // or your auth logic

    if (token) {
      setIsAuthenticated(true); // user is authenticated
    } else {
      setIsAuthenticated(false); // user is not authenticated
      router.replace("/login"); // redirect to login page
    }
  }, [router]);

  if (isAuthenticated === null) {
    // still checking auth, don't render anything
    return null; 
  }

  if (!isAuthenticated) {
    // user is redirected, still don't render the page
    return null;
  }

  // user is authenticated, render the protected page
  return <>{children}</>;
}
