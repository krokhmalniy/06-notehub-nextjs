import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

interface NotesPageProps {
  searchParams?: {
    query?: string;
  };
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const queryClient = new QueryClient();

  const searchQuery = searchParams?.query ?? '';

  await queryClient.prefetchQuery({
    queryKey: ['notes', searchQuery],
    queryFn: () => fetchNotes(searchQuery),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient searchQuery={searchQuery} />
    </HydrationBoundary>
  );
}
