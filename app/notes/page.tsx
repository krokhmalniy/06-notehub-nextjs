import { dehydrate } from "@tanstack/react-query";
import Hydrate from "@/components/TanStackProvider/HydrateClient";
import getQueryClient from "@/lib/getQueryClient";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const queryClient = getQueryClient();

  const page = Number(searchParams.page) || 1;
  const perPage = 12;
  const search = searchParams.search || "";

  // Prefetch notes on the server
  await queryClient.prefetchQuery({
    queryKey: ["notes", page, perPage, search],
    queryFn: () =>
      fetchNotes({
        page,
        perPage,
        search,
      }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <NotesClient
        initialPage={page}
        perPage={perPage}
        initialSearch={search}
      />
    </Hydrate>
  );
}
