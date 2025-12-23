import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Reporters Directory",
  description: "Sign in or create an account to access the Reporters Directory",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
