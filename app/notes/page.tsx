import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

export default async function NotesPage(props: {
  searchParams: Promise<{
    page?: string;
    perPage?: string;
    search?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const perPage = Number(searchParams.perPage) || 12;
  const search = searchParams.search || "";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { page, perPage, search }],
    queryFn: () => fetchNotes({ page, perPage, search }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        initialPage={page}
        perPage={perPage}
        initialSearch={search}
      />
    </HydrationBoundary>
  );
}
