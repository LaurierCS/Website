import { HACKATHON_EVENT } from '../components/hackathon/hackathonData';
import { absoluteUrl, HACKATHON_DESCRIPTION, HACKATHON_PATH, OG_IMAGE_PATH, SITE_NAME, SITE_URL } from './site';

export function getHackathonEventJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: HACKATHON_EVENT.title,
    description: HACKATHON_DESCRIPTION,
    startDate: '2026-03-27',
    endDate: '2026-03-29',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    url: absoluteUrl(HACKATHON_PATH),
    image: absoluteUrl(OG_IMAGE_PATH),
    location: {
      '@type': 'Place',
      name: 'Wilfrid Laurier University',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Waterloo',
        addressRegion: 'ON',
        addressCountry: 'CA',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
