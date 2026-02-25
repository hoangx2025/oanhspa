import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { verifySync } from "otplib";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 86400 },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",          type: "email" },
        password: { label: "Password",       type: "password" },
        totp:     { label: "Mã xác thực",    type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.aspNetUsers.findUnique({
          where: { email: credentials.email },
          include: { userRoles: { include: { role: true } } },
        });

        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        const roles = user.userRoles.map((ur) => ur.role.name).filter(Boolean) as string[];
        if (!roles.includes("Admin")) return null;

        // ── MFA check ──────────────────────────────────────────────
        if (user.twoFactorEnabled) {
          if (!credentials.totp) {
            // Báo frontend cần nhập mã TOTP
            throw new Error("MFA_REQUIRED");
          }

          const tokenRecord = await db.aspNetUserTokens.findFirst({
            where: { userId: user.id, loginProvider: "Authenticator", name: "AuthenticatorKey" },
          });

          if (!tokenRecord?.value) throw new Error("MFA_INVALID");

          const result = verifySync({
            token: credentials.totp.replace(/\s/g, ""),
            secret: tokenRecord.value,
          });
          if (!result.valid) throw new Error("MFA_INVALID");
        }
        // ───────────────────────────────────────────────────────────

        return { id: user.id, email: user.email ?? "", name: user.userName ?? "", role: "Admin" };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = (user as { role?: string }).role ?? "Admin";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
