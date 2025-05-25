"use client";

import { createClient } from "@/utils/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Suspense, useEffect } from "react";

function LoginButton() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams.get("next");

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push(next || "/");
        router.refresh();
      }
    };
    checkUser();
  }, [router, next, supabase.auth]);

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback${
            next ? `?next=${encodeURIComponent(next)}` : ""
          }`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  return (
    <button
      className="bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 border border-gray-400 rounded shadow flex items-center gap-x-2.5"
      onClick={loginWithGoogle}
    >
      <FcGoogle size="1.3em" />
      Sign in with Google
    </button>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginButton />
      </Suspense>
    </div>
  );
}
