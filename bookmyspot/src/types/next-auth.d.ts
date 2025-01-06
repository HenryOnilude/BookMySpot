// src/types/next-auth.d.ts
import { User as PrismaUser, UserType } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      type: UserType;
    } & DefaultSession["user"]
  }

  interface User extends Omit<PrismaUser, "password"> {}
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    type: UserType;
  }
}