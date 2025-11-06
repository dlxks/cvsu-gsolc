import { signIn, signOut } from "@/lib/auth";
import { Button } from "../ui/button";
import { FaGoogle } from "react-icons/fa";

export function SignIn({ provider }: { provider?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
    >
      <Button
        type="submit"
        variant="outline"
        className="flex items-center gap-2"
      >
        <FaGoogle />
        <span>
          Sign in with <strong className="capitalize">{provider}</strong>
        </span>
      </Button>
    </form>
  );
}

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="w-full"
    >
      <button className="bg-neutral-700 text-white p-2 rounded-md">
        Sign Out
      </button>
    </form>
  );
}
