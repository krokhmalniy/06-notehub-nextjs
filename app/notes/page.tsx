import { dehydrate } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import getQueryClient from "@/lib/getQueryClient";
import NotesClient from "./Notes.client";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const page = Number(searchParams.page) || 1;
  const perPage = 12;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";

  const queryClient = getQueryClient();

  // PREFETCH на сервері
  await queryClient.prefetchQuery({
    queryKey: ["notes", page, perPage, search],
    queryFn: () => fetchNotes({ page, perPage, search }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <NotesClient
      initialPage={page}
      perPage={perPage}
      initialSearch={search}
      dehydratedState={dehydratedState}
    />
  );
}
