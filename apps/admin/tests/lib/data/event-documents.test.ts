import { UnavailableError } from '../../../src/lib/server/errors';
import { addDocument, deleteDocument, getDocument, listDocuments, reorderDocuments, updateDocument } from '../../../src/lib/data/event-documents';
import type { CheckedImage } from '../../../src/lib/ui/images';
import { BUCKETS, removeImage, uploadImage } from '../../../src/lib/server/storage';
import type { EventDocument } from '../../../src/types/event-document';
import { installV2Supabase, STORAGE_BASE } from '../server/supabase-v2-mock';

vi.mock('../../../src/lib/server/supabase');
vi.mock('../../../src/lib/server/storage', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../src/lib/server/storage')>()),
  uploadImage: vi.fn(),
  removeImage: vi.fn(),
}));

const EVENT_ID = '0b6f9c2e-7a41-4d5b-8e3c-2f1a9b8c7d6e';
const DOC_ID = '1c7a0d3f-8b52-4e6c-9f4d-3a2b1c0d9e8f';
const DOC_PATH = `${EVENT_ID}/docs/document1.pdf`;

const GOOD_ROW = {
  id: DOC_ID,
  event_id: EVENT_ID,
  title: 'Presentation Slides',
  path: DOC_PATH,
  sort_order: 0,
};

const DOCUMENT: EventDocument = {
  id: DOC_ID,
  eventId: EVENT_ID,
  title: 'Presentation Slides',
  path: DOC_PATH,
  fileUrl: `${STORAGE_BASE}/${BUCKETS.events}/${DOC_PATH}`,
  sortOrder: 0,
};

const FILE: CheckedImage = { file: new File(['x'], 'doc.pdf', { type: 'application/pdf' }), extension: 'pdf' };
const DOC_PATH_NEW = `${EVENT_ID}/docs/document2.pdf`;
const SAVED = { data: [{ id: DOC_ID }], error: null };
const FAILED = { data: null, error: { message: 'boom' } };

beforeEach(() => {
  vi.mocked(uploadImage).mockResolvedValue(DOC_PATH_NEW);
});

describe('listDocuments', () => {
  it('returns all documents for an event in sort order', async () => {
    const order = vi.fn().mockResolvedValue({ data: [GOOD_ROW], error: null });
    installV2Supabase({ event_documents: { select: vi.fn(() => ({ eq: vi.fn(() => ({ order })) })) } });

    expect(await listDocuments(EVENT_ID)).toEqual([DOCUMENT]);
  });

  it('returns empty list for invalid event id', async () => {
    expect(await listDocuments('not-a-uuid')).toEqual([]);
  });

  it('reports a failed read as unavailable', async () => {
    const order = vi.fn().mockResolvedValue(FAILED);
    installV2Supabase({ event_documents: { select: vi.fn(() => ({ eq: vi.fn(() => ({ order })) })) } });

    await expect(listDocuments(EVENT_ID)).rejects.toBeInstanceOf(UnavailableError);
  });
});

describe('getDocument', () => {
  it('returns a document by id', async () => {
    installV2Supabase({
      event_documents: {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue({ data: GOOD_ROW, error: null }) })),
        })),
      },
    });

    expect(await getDocument(DOC_ID)).toEqual(DOCUMENT);
  });

  it('returns null when document does not exist', async () => {
    installV2Supabase({
      event_documents: { select: vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) })) })) },
    });

    expect(await getDocument(DOC_ID)).toBeNull();
  });
});

describe('addDocument', () => {
  it('uploads document and saves it', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const select = vi.fn(() => ({ eq: vi.fn(() => ({ order: vi.fn(() => ({ limit: vi.fn().mockResolvedValue({ data: [], error: null }) })) })) }));
    installV2Supabase({ event_documents: { insert, select } });

    await addDocument(EVENT_ID, 'Slides', FILE);

    expect(uploadImage).toHaveBeenCalledWith(BUCKETS.events, FILE, `${EVENT_ID}/docs`);
    expect(insert).toHaveBeenCalled();
  });

  it('removes uploaded file if insert fails', async () => {
    installV2Supabase({ event_documents: { insert: vi.fn().mockResolvedValue({ error: { message: 'failed' } }), select: vi.fn(() => ({ eq: vi.fn(() => ({ order: vi.fn(() => ({ limit: vi.fn().mockResolvedValue({ data: [], error: null }) })) })) })) } });

    await expect(addDocument(EVENT_ID, 'Slides', FILE)).rejects.toThrow();
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.events, DOC_PATH_NEW);
  });
});

describe('updateDocument', () => {
  it('updates the title', async () => {
    const update = vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) })) }));
    installV2Supabase({ event_documents: { update } });

    await updateDocument(DOCUMENT, { title: 'New Title' });

    expect(update).toHaveBeenCalledWith({ title: 'New Title' });
  });
});

describe('deleteDocument', () => {
  it('deletes a document and removes its file', async () => {
    const eq = vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) }));
    installV2Supabase({ event_documents: { delete: vi.fn(() => ({ eq })) } });

    await deleteDocument(DOCUMENT);

    expect(removeImage).toHaveBeenCalledWith(BUCKETS.events, DOC_PATH);
  });
});

describe('reorderDocuments', () => {
  it('updates sort orders', async () => {
    const documents: EventDocument[] = [
      { ...DOCUMENT, sortOrder: 0 },
      { ...DOCUMENT, id: '2d8b1e4f-9c6a-4f7d-8e5b-0c1d2e3f4g5h', sortOrder: 1 },
    ];
    const update = vi.fn(() => ({ eq: vi.fn(() => ({}) ) }));
    installV2Supabase({ event_documents: { update } });

    await reorderDocuments(documents);

    expect(update).toHaveBeenCalledTimes(2);
  });
});
