/** Event documents loaded and cached by TanStack Query, and the changes that refresh them. */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addDocument, deleteDocument, getDocument, listDocuments, reorderDocuments, updateDocument } from '../lib/data/event-documents';
import type { CheckedImage } from '../lib/ui/images';
import type { EventDocument, DocumentFields } from '../types/event-document';

// Every documents query for an event starts with this key.
const makeDocumentsKey = (eventId: string) => ['documents', eventId] as const;

export function useEventDocuments(eventId: string) {
  return useQuery({ queryKey: makeDocumentsKey(eventId), queryFn: () => listDocuments(eventId) });
}

/** One document for editing; `data` is null when there is no such document. */
export function useEventDocument(id: string) {
  return useQuery({ queryKey: ['document', id], queryFn: () => getDocument(id) });
}

/** Refreshes documents for an event once a change has been saved. */
function useRefreshDocuments(eventId: string) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: makeDocumentsKey(eventId) });
}

export function useAddDocument(eventId: string) {
  const refresh = useRefreshDocuments(eventId);
  return useMutation({
    mutationFn: ({ title, file }: { title: string; file: CheckedImage }) => addDocument(eventId, title, file),
    onSuccess: refresh,
  });
}

export function useUpdateDocument(document: EventDocument) {
  const refresh = useRefreshDocuments(document.eventId);
  return useMutation({
    mutationFn: (changes: Partial<DocumentFields>) => updateDocument(document, changes),
    onSuccess: refresh,
  });
}

export function useDeleteDocument(document: EventDocument) {
  const refresh = useRefreshDocuments(document.eventId);
  return useMutation({ mutationFn: () => deleteDocument(document), onSuccess: refresh });
}

export function useReorderDocuments(eventId: string) {
  const refresh = useRefreshDocuments(eventId);
  return useMutation({ mutationFn: (documents: readonly EventDocument[]) => reorderDocuments(documents), onSuccess: refresh });
}
