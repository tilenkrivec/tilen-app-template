import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <main className="flex flex-col gap-8 items-center max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to Your App
        </h1>
        <p className="text-lg text-muted-foreground">
          A Next.js 15 template with authentication, Hasura GraphQL, and object
          storage.
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="/login"
            className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border border-input bg-background px-6 py-3 text-sm font-semibold shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
