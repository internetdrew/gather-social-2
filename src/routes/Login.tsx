import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Login = () => {
  return (
    <div className="mx-auto my-auto">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Login to get started</CardTitle>
          <CardDescription>
            Once you login, you'll be able to create your own event galleries
            and invite your friends and family to join.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
