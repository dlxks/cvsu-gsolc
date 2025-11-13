import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,

  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: { params: { prompt: "select_account" } },

      profile(profile) {
        return {
          id: profile.sub, // Google unique user ID
          email: profile.email,
          firstName: profile.given_name,
          lastName: profile.family_name,
          middleName: null,
          image: profile.picture,
          role: "STUDENT", // default role for first sign-in
        };
      },
    }),
  ],

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  callbacks: {
    /**
     * Runs on every sign-in attempt
     * Used to sync role & ensure returning users do not overwrite default fields
     */
    async signIn({ user }) {
      if (!user.email) return true;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      // If returning user → preserve database values instead of provider defaults
      if (existingUser) {
        user.id = existingUser.id;
        user.role = existingUser.role;
      }

      return true;
    },

    /**
     * Enrich session.user with data from DB
     */
    async session({ session }) {
      if (!session.user?.email) return session;

      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          role: true,
        },
      });

      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.firstName = dbUser.firstName;
        session.user.middleName = dbUser.middleName;
        session.user.lastName = dbUser.lastName;
        session.user.role = dbUser.role;
      }

      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },

  /**
   * After a new user is created in DB, enforce default middleName = null
   */
  events: {
    async createUser({ user }) {
      if (!user?.id) {
        console.warn("Skipping user creation - missing user id")
        return
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { middleName: null },
      });
    },
  },
});
