/**
 * TODO Data - Placeholder typed stubs for missing database fields
 *
 * These are placeholders for features that need database support.
 * Each stub is clearly marked as TODO and includes the database field
 * it's waiting on. Components should check for data existence before
 * rendering these sections.
 */

// TODO(db): needs events.type column
export type EventType =
  | 'workshop'
  | 'hackathon'
  | 'review'
  | 'series'
  | 'social'
  | 'other';

export interface EventTypeData {
  id: string;
  eventId: string;
  type: EventType;
  // TODO(db): needs events.type
}

// TODO(db): needs events.series column or event_series table
export interface EventSeries {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  // TODO(db): needs events.series FK
}

// TODO(db): needs events.youtube_recording_url column
export interface EventRecording {
  eventId: string;
  youtubeUrl: string;
  title: string;
  // TODO(db): needs events.youtube_recording_url
}

// TODO(db): needs event_resources table (id, event_id, type, url)
export interface EventResource {
  id: string;
  eventId: string;
  type: 'slides' | 'docs' | 'recording' | 'repo';
  url: string;
  label: string;
}

// TODO(db): needs event_photos table (id, event_id, photo_url, created_at)
export interface EventPhoto {
  id: string;
  eventId: string;
  photoUrl: string;
  caption?: string;
  createdAt: string;
}

// TODO(db): needs event_relations table or manual linking mechanism
export interface RelatedEvent {
  id: string;
  eventId: string;
  relatedEventId: string;
  reason?: string; // e.g., "part_of_series", "follow_up", "similar"
}

// TODO(db): needs events.is_streamed, events.next_stream_time columns
export interface StreamInfo {
  eventId: string;
  isStreamed: boolean;
  streamUrl?: string;
  nextStreamTime?: string;
}

// TODO: YouTube videos integration - needs YouTube API integration
export interface YoutubeVideo {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  url: string;
  publishedAt: string;
  viewCount?: number;
}

// Example stub data for What We Host section
export const whatWeHostData = [
  {
    id: 'reviews',
    name: 'Meet the Pros',
    description: 'Industry professionals share insights and answer your questions',
    icon: '💼',
    upcoming: null,
  },
  {
    id: 'hackathon',
    name: 'Hack to the Future',
    description: 'Our annual hackathon competition',
    icon: '🔨',
    upcoming: null,
  },
  {
    id: 'workshops',
    name: 'Workshops',
    description: 'Learn new skills from experienced instructors',
    icon: '📚',
    upcoming: null,
  },
  {
    id: 'socials',
    name: 'Social Events',
    description: 'Build community and network with members',
    icon: '🎉',
    upcoming: null,
  },
];

// Example stats configuration
export const statsConfig = {
  eventsPerYear: 20,
  execMembers: 44,
  reachStudents: 4000,
};

// Example stream placeholder
export const streamPlaceholder: StreamInfo = {
  eventId: 'upcoming-stream',
  isStreamed: false,
  streamUrl: undefined,
  nextStreamTime: undefined,
};
