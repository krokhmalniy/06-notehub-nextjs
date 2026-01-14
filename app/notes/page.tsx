import { Hydrate, dehydrate } from "@tanstack/react-query";

import getQueryClient from "@/lib/getQueryClient";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function NotesPage() {
  const queryClient = getQueryClient();

  const page = 1;
  const perPage = 12;
  const search = "";

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
