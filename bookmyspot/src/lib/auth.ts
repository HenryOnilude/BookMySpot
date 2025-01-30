import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { User, UserType } from "@prisma/client"
import type { JWT } from "next-auth/jwt"

// Define the authenticated user type
interface AuthenticatedUser {
  id: string
  email: string
  name: string
  type: UserType
  emailVerified: Date | null
  image?: string | null
}

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: AuthenticatedUser
  }
  
  // Also extend the User type for consistency
  interface User extends AuthenticatedUser {}
}

// Extend the built-in JWT types
declare module "next-auth/jwt" {
  interface JWT extends Omit<AuthenticatedUser, 'image'> {
    picture?: string | null  // JWT uses 'picture' instead of 'image'
  }
}

// Define the credentials type
interface Credentials {
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    newUser: '/register'
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            type: true,
            emailVerified: true,
            image: true
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        const { password: _, ...userWithoutPassword } = user
        return userWithoutPassword
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Explicitly type the token update
        const updatedToken: JWT = {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          type: user.type,
          emailVerified: user.emailVerified,
          picture: user.image
        }
        return updatedToken
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
          name: token.name,
          type: token.type as UserType,
          emailVerified: token.emailVerified,
          image: token.picture
        }
      }
    }
  }
}