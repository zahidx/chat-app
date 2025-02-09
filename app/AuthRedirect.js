"use client"; // This is necessary for client-side logic

import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation"; // Import the Next.js router

const AuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is logged in, redirect to /chatroom (only if not already there)
        if (window.location.pathname !== "/chatroom") {
          router.push("/chatroom");
        }
      } else {
        // If user is not logged in, redirect to home (only if not already there)
        if (window.location.pathname !== "/") {
          router.push("/");
        }
      }
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, [router]);

  return null; // This component doesn't render anything
};

export default AuthRedirect;
