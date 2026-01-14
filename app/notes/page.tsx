import { dehydrate, Hydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

type NotesPageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
};

const PER_PAGE = 12;

export default async function NotesPage({ searchParams }: NotesPageProps) {
  // ❗️ВАЖЛИВО: одразу дістаємо значення і більше НЕ використовуємо searchParams
  const { page: pageParam, search: searchParam } = await searchParams;

  const page = pageParam ? Number(pageParam) : 1;
  const search = searchParam ?? "";

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { page, perPage: PER_PAGE, search }],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <NotesClient />
    </Hydrate>
  );
}
