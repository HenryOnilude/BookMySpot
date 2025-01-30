// src/types/next-auth.d.ts
import { User as PrismaUser, UserType } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      type: UserType;
      emailVerified: Date | null;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    email: string;
    name: string;
    type: UserType;
    emailVerified: Date | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    type: UserType;
    emailVerified: Date | null;
    picture?: string | null;
  }
}