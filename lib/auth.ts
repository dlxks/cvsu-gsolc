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
    async signIn({ user, account }) {
      if (!user.email) return false;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        // ✅ If it's a Google login, but the account isn't linked yet — link it
        if (account?.provider === "google") {
          const existingAccount = await prisma.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: "google",
            },
          });

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                type: account.type,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          }
        }

        user.id = existingUser.id;
        user.role = existingUser.role;
        return true;
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
