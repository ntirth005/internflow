import { z } from "zod";

const isProduction = process.env.NODE_ENV === "production";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: isProduction
    ? z.string().min(16, "JWT Secret must be at least 16 characters long in production")
    : z.string().default("fallback_secret_for_development_purposes_only"),
  CERTIFICATE_SECRET: isProduction
    ? z.string().min(16, "Certificate Signature Secret must be at least 16 characters long in production")
    : z.string().default("skillbridge_certificate_hmac_sha256_private_secret_key"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const getAppUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return undefined;
};

const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  CERTIFICATE_SECRET: process.env.CERTIFICATE_SECRET,
  NEXT_PUBLIC_APP_URL: getAppUrl(),
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:", JSON.stringify(parsed.error.format(), null, 2));
  throw new Error("Invalid environment configuration. Please check your .env file or configuration settings.");
}

export const env = parsed.data;
