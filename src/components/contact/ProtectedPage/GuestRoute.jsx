// components/GuestRoute.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GuestRoute({ children, redirectTo = "/dashboard/fields" }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("access");
      // debug log
      console.log("GuestRoute: access token ->", token);

      if (token) {
        console.log("GuestRoute: token present, redirecting to", redirectTo);
        router.replace(redirectTo);
      } else {
        console.log("GuestRoute: no token, showing children");
        setAuthChecked(true);
      }
    } catch (err) {
      console.error("GuestRoute: error reading localStorage", err);
      setAuthChecked(true);
    }
  }, [router, redirectTo]);

  if (!authChecked)
    return (
      <div className="w-full flex items-center justify-center p-8">
        <div className="text-center text-gray-600">Checking authentication...</div>
      </div>
    );

  return <>{children}</>;
}
