import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";

import { authRoutes, publicRoutes, ROUTES } from "./constants/routes";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          user.hashedPassword,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const pathname = nextUrl.pathname;

      // Skip static assets and API routes
      if (
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/_next") ||
        /\.(?:css|js|json|ico|png|jpg|jpeg|gif|svg|webp|woff2?)$/.test(pathname)
      ) {
        return true;
      }

      // Authenticated user visiting auth pages → redirect to home
      if (isLoggedIn && authRoutes.includes(pathname)) {
        return Response.redirect(new URL(ROUTES.HOME, nextUrl));
      }

      // Unauthenticated user visiting protected pages → redirect to login
      if (!isLoggedIn && !publicRoutes.includes(pathname)) {
        return Response.redirect(new URL(ROUTES.LOGIN, nextUrl));
      }

      return true;
    },
  },
});
