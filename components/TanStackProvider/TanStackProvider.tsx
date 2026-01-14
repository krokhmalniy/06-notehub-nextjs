"use client";

import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
} from "@tanstack/react-query";
import { ReactNode, useState } from "react";

interface TanStackProviderProps {
  children: ReactNode;
  initialState?: unknown;
}

export default function TanStackProvider({
  children,
  initialState,
}: TanStackProviderProps) {
  // Створюємо клієнт лише один раз
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* Hydrate потрібно для SSR-prefetch із сторінок */}
      <Hydrate state={initialState}>{children}</Hydrate>
    </QueryClientProvider>
  );
}
