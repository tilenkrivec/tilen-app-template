export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your protected dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Hasura Integration</h3>
          <p className="text-sm text-muted-foreground">
            Connect to your Hasura GraphQL endpoint to start querying data.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Object Storage</h3>
          <p className="text-sm text-muted-foreground">
            Upload and manage files using Hetzner S3-compatible storage.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Authentication</h3>
          <p className="text-sm text-muted-foreground">
            Simple password-based authentication with JWT sessions.
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-3">Getting Started</h3>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
          <li>Configure your environment variables in .env.local</li>
          <li>Set up your Hasura GraphQL endpoint and admin secret</li>
          <li>Configure Hetzner Object Storage credentials</li>
          <li>Start building your application features</li>
        </ul>
      </div>
    </div>
  );
}
