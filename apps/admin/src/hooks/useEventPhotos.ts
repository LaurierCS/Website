/** Event photos loaded and cached by TanStack Query, and the changes that refresh them. */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addPhoto, deletePhoto, getPhoto, listPhotos, reorderPhotos, setCover, updatePhoto } from '../lib/event-photos';
import type { PictureChange } from '../lib/images';
import type { EventPhoto, PhotoFields } from '../types/event-photo';

// Every photos query for an event starts with this key.
const makePhotosKey = (eventId: string) => ['photos', eventId] as const;

export function useEventPhotos(eventId: string) {
  return useQuery({ queryKey: makePhotosKey(eventId), queryFn: () => listPhotos(eventId) });
}

/** One photo for editing; `data` is null when there is no such photo. */
export function useEventPhoto(id: string) {
  return useQuery({ queryKey: ['photo', id], queryFn: () => getPhoto(id) });
}

/** Refreshes photos for an event once a change has been saved. */
function useRefreshPhotos(eventId: string) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: makePhotosKey(eventId) });
}

export function useAddPhoto(eventId: string) {
  const refresh = useRefreshPhotos(eventId);
  return useMutation({
    mutationFn: (picture: PictureChange) => addPhoto(eventId, picture),
    onSuccess: refresh,
  });
}

export function useUpdatePhoto(photo: EventPhoto) {
  const refresh = useRefreshPhotos(photo.eventId);
  return useMutation({
    mutationFn: (changes: Partial<PhotoFields>) => updatePhoto(photo, changes),
    onSuccess: refresh,
  });
}

export function useDeletePhoto(photo: EventPhoto) {
  const refresh = useRefreshPhotos(photo.eventId);
  return useMutation({ mutationFn: () => deletePhoto(photo), onSuccess: refresh });
}

export function useSetCover(eventId: string) {
  const refresh = useRefreshPhotos(eventId);
  return useMutation({ mutationFn: (photoId: string) => setCover(eventId, photoId), onSuccess: refresh });
}

export function useReorderPhotos(eventId: string) {
  const refresh = useRefreshPhotos(eventId);
  return useMutation({ mutationFn: (photos: readonly EventPhoto[]) => reorderPhotos(photos), onSuccess: refresh });
}
