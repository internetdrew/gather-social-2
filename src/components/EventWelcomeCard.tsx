import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EllipsisVerticalIcon } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { Button } from "./ui/button";
import { useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabase";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../server";
import { Link } from "react-router";
import EventWelcomeUserActions from "./EventWelcomeUserActions";

type EventData = inferRouterOutputs<AppRouter>["event"]["getById"];

const EventWelcomeCard = ({ event }: { event: EventData }) => {
  const [signingIn, setSigningIn] = useState(false);
  const { user } = useAuth();

  const userIsHost = user?.id === event?.host_id;

  const signInForEvent = async (eventId: string) => {
    setSigningIn(true);
    try {
      await supabaseBrowserClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/events/${eventId}`,
        },
      });
    } catch (error) {
      console.error(error);
      setSigningIn(false);
    }
  };

  if (!event) {
    return null;
  }

  return (
    <Card className="mx-auto mt-28 w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">
          Welcome to the gallery for <em>{event?.title}</em>!
        </CardTitle>
        <CardDescription></CardDescription>
        {userIsHost && (
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/admin/gallery/${event?.id}`}>
                    View admin gallery
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {user ? (
          <EventWelcomeUserActions eventId={event?.id} />
        ) : (
          <>
            <p>You're almost there! Please sign in to continue.</p>
            <Button
              onClick={() => signInForEvent(event?.id)}
              disabled={signingIn}
            >
              {signingIn ? "Signing in..." : "Continue with Google"}
            </Button>
            <p className="text-muted-foreground text-xs">
              By continuing, you agree to our{" "}
              <Link to="/terms">Terms of Service</Link> and{" "}
              <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2 text-sm font-medium">
        <p className="text-muted-foreground font-medium">
          {userIsHost
            ? "You're hosting this event"
            : `Hosted by ${event?.host?.full_name}`}
        </p>

        <Avatar className="h-7 w-7">
          <AvatarImage
            src={event?.host?.avatar_url ?? undefined}
            alt={event?.host?.full_name ?? ""}
          />
          <AvatarFallback>{event?.host?.full_name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </CardFooter>
    </Card>
  );
};

export default EventWelcomeCard;
