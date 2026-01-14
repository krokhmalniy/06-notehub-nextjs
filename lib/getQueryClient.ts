import { QueryClient } from "@tanstack/react-query";

let client: QueryClient | null = null;

export default function getQueryClient() {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60, // 1 хвилина
          refetchOnWindowFocus: false,
        },
      },
    });
  }

  return client;
}
