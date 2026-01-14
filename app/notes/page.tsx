import { dehydrate, Hydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface NotesPageParams {
  search?: string;
  page?: string;
}

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<NotesPageParams>;
}) {
  const params = await searchParams;

  const initialPage = params.page ? Number(params.page) : 1;
  const initialSearch = params.search ?? "";
  const perPage = 12;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { page: initialPage, perPage, search: initialSearch }],
    queryFn: () =>
      fetchNotes({
        page: initialPage,
        perPage,
        search: initialSearch,
      }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <NotesClient
        initialPage={initialPage}
        perPage={perPage}
        initialSearch={initialSearch}
      />
    </Hydrate>
  );
}
