export const SITE_URL = 'https://lauriercs.org';
export const SITE_NAME = 'Laurier Computing Society';

export const HOME_TITLE = 'Laurier CS Club | Laurier Computing Society';
export const HOME_DESCRIPTION =
  "Join Laurier Computing Society, Wilfrid Laurier University's official CS club. Hackathons, workshops, and career events for WLU computer science students in Waterloo.";

export const HACKATHON_PATH = '/hack-to-the-future';
export const HACKATHON_TITLE = 'Hack to the Future | LCS Hackathon — Wilfrid Laurier University';
export const HACKATHON_DESCRIPTION =
  "Hack to the Future is Laurier Computing Society's annual WLU hackathon. Compete for prizes, build projects, and connect with Waterloo's tech community.";

export const OG_IMAGE_PATH = '/assets/og-image.png';

export function absoluteUrl(path: string | undefined): string {
  if (!path) {
    return SITE_URL;
  }
  if (path.startsWith('http')) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
