import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth";
import { supabaseBrowserClient } from "@/lib/supabase";
import { useState } from "react";

const RequireSignin = ({ children }: { children: React.ReactNode }) => {
  const [signingIn, setSigningIn] = useState(false);
  const { user } = useAuth();

  const signInWithGoogle = async () => {
    setSigningIn(true);
    try {
      await supabaseBrowserClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error(error);
      setSigningIn(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto mt-52">
        <Card className="w-96">
          <CardHeader className="space-y-2">
            <CardTitle>Login to get started</CardTitle>
            <CardDescription>
              Once you login, you'll be able to create your own event gallery
              and invite others to add photos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={signInWithGoogle}
              disabled={signingIn}
            >
              {signingIn ? "Signing in..." : "Continue with Google"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
};

export default RequireSignin;
