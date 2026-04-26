import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role } from "../../generated/prisma";

const rawBaseUrl = (process.env.BETTER_AUTH_URL || "").trim();
const baseURL = rawBaseUrl.replace(/\/api\/auth\/?$/i, "") || rawBaseUrl;
const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL;
const isProduction = baseURL?.startsWith("https://");

export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL,

  trustedOrigins: frontendUrl ? [frontendUrl] : [],

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  advanced: {
    defaultCookieAttributes: isProduction
      ? { sameSite: "none", secure: true }
      : undefined,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: Role.USER,
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

      accessType: "offline",
    },
  },
});
