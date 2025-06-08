"use client";

import { GithubLogo, GoogleLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Provider } from "@supabase/supabase-js";
import { toast } from "sonner";

export default function LoginPage() {
  const supabase = createClient();

  const handleLogin = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-foreground/5 flex min-h-screen items-center justify-center">
      <div className="bg-card flex w-full max-w-sm flex-col items-center rounded-xl border p-10 pb-12">
        <h1 className="text-2xl font-semibold">Log in to Bloxxee</h1>
        <Button
          onClick={() => handleLogin("github")}
          className="mt-10 w-full leading-0.5"
        >
          <GithubLogo className="mr-1 size-5" />
          Log in with GitHub
        </Button>
        <Button
          onClick={() => handleLogin("google")}
          className="mt-3 w-full leading-0.5"
        >
          <GoogleLogo className="mr-1 size-5" />
          Log in with Google
        </Button>
      </div>
    </div>
  );
}
