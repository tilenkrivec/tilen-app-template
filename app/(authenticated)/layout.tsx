import { getAuthStatus } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await getAuthStatus();

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">Your App</h1>
          <nav className="flex items-center gap-4">
            <a
              href="/dashboard"
              className="text-sm hover:text-primary transition-colors"
            >
              Dashboard
            </a>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Logout
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
