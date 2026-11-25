/**
 * Re-export all library modules from their categories.
 * This maintains backward compatibility while organizing code into logical subfolders.
 */

// Data layer - CRUD operations
export * from './data/events';
export * from './data/team';
export * from './data/guests';
export * from './data/event-photos';
export * from './data/event-hosts';
export * from './data/event-documents';
export * from './data/event-related';

// CSV import/export
export * from './csv/csv';
export * from './csv/csv-import';
export * from './csv/csv-formats';

// UI utilities
export * from './ui/images';
export * from './ui/accents';
export * from './ui/saved-notice';
export * from './ui/text-diff';
export * from './ui/crop-image';

// Authentication
export * from './auth/auth';

// Configuration
export * from './config/config';

// Server/core utilities
export * from './server/errors';
export * from './server/supabase';
export * from './server/storage';

// Time/date utilities
export * from './time/dates';

// Form utilities - import form files directly to avoid collision on formValuesFor
// (use: import { formValuesFor } from './lib/form/event-form' or './lib/form/member-form')
export { type EventFormValues, type ChangedFields, EventFormSchema, EMPTY_EVENT_FORM, unreadableTime, toEventFields, ticketPreview, changedEventFields, eventTimeLabel, toTicketFace } from './form/event-form';
export { type MemberFormValues, type CheckedMemberForm, type ChangedMemberFields, MemberFormSchema, EMPTY_MEMBER_FORM, toMemberFields, badgePreview, changedMemberFields } from './form/member-form';

// Miscellaneous
export * from './other/download';
export * from './other/update-reload';
