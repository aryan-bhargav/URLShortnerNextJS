import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Login or create an account to manage your short links.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      {children}
    </main>
  );
}
