import { dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import { Hydrate } from "@tanstack/react-query";

interface NoteDetailsParams {
  id: string;
}

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<NoteDetailsParams>;
}) {
  const { id } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <NoteDetailsClient />
    </Hydrate>
  );
}
