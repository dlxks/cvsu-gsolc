import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      firstName?: string | null;
      middleName?: string | null;
      lastName?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/dist/adapters" {
  interface AdapterUser {
    role: string;
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
  }
}
