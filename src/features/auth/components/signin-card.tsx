import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { TriangleAlert } from "lucide-react";
import { SignInFlow } from "../types";
import { FormEvent, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

function SigninCard({ setState }: SignInCardProps) {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handlePasswordProvider = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    signIn("password", { email, password, flow: "signIn" })
      .catch((err) => {
        console.log("Error💥", err);
        setError("Inavalid email or password.");
      })
      .finally(() => setPending(false));
  };

  const handleProvider = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => setPending(false));
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="pt-0 px-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your eamil or other service to continue
        </CardDescription>
      </CardHeader>

      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex  items-center gap-x-2 text-sm text-destructive">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}

      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={handlePasswordProvider} className="space-y-2.5 ">
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />

          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />

          <Button
            type="submit"
            className="w-full"
            size={"lg"}
            disabled={pending}
            title="Log In"
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            size={"lg"}
            onClick={() => handleProvider("google")}
            variant={"outline"}
            className="w-full relative"
          >
            <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
            Continue with Google
          </Button>

          <Button
            disabled={pending}
            size={"lg"}
            onClick={() => handleProvider("github")}
            variant={"outline"}
            className="w-full relative"
          >
            <FaGithub className="size-5 absolute top-2.5 left-2.5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Don't have an account?{" "}
          <span
            onClick={() => setState("signUp")}
            className="hover:underline text-sky-700  cursor-pointer"
          >
            sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
}

export default SigninCard;
