import { betterAuth } from "better-auth";

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "fallback-dev-secret-clean-calc-min-32-characters-long",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder-client-secret",
      enabled: Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ),
    },
  },
});
