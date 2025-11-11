import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support";

const HASURA_ENDPOINT =
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ||
  "http://localhost:8080/v1/graphql";
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET || "";

/**
 * Create HTTP link with Hasura endpoint
 */
const httpLink = new HttpLink({
  uri: HASURA_ENDPOINT,
  fetchOptions: { cache: "no-store" },
});

/**
 * Add authentication headers to every request
 */
const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
    },
  });
  return forward(operation);
});

/**
 * Server-side Apollo Client for React Server Components
 * Use this in server components with getClient()
 */
export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
});

/**
 * Client-side Apollo Client for use in client components
 * Wrap your client components with ApolloProvider using this client
 */
export function createApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
}
