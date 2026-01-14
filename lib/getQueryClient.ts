import { QueryClient } from "@tanstack/react-query";

let client: QueryClient | null = null;

export default function getQueryClient() {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          // 5 хвилин дані вважаються свіжими
          staleTime: 1000 * 60 * 5,

          // час життя кешу (react-query v4 використовує cacheTime)
          cacheTime: 1000 * 60 * 10,

          refetchOnWindowFocus: false,
        },
      },
    });
  }

  return client;
}
