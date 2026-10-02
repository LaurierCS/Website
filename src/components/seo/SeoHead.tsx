import { useEffect } from 'react';
import {
  absoluteUrl,
  HOME_DESCRIPTION,
  HOME_TITLE,
  OG_IMAGE_PATH,
  SITE_NAME,
  SITE_URL,
} from '../../seo/site';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  robots?: string;
  jsonLd?: Record<string, unknown>;
}

const OG_IMAGE_URL = absoluteUrl(OG_IMAGE_PATH);
const JSON_LD_SCRIPT_ID = 'page-json-ld';

function setMeta(name: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setProperty(property: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(href: string) {
  let element = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function setJsonLd(data: Record<string, unknown> | undefined) {
  const existing = document.getElementById(JSON_LD_SCRIPT_ID);
  existing?.remove();
  if (!data) {
    return;
  }
  const script = document.createElement('script');
  script.id = JSON_LD_SCRIPT_ID;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function applyTags(title: string, description: string, canonical: string, robots?: string) {
  document.title = title;
  setMeta('description', description);
  setCanonical(canonical);
  setProperty('og:title', title);
  setProperty('og:description', description);
  setProperty('og:url', canonical);
  setProperty('og:image', OG_IMAGE_URL);
  setProperty('og:site_name', SITE_NAME);
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  setMeta('twitter:image', OG_IMAGE_URL);

  const robotsMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (robots) {
    setMeta('robots', robots);
  } else {
    robotsMeta?.remove();
  }
}

/**
 * Overrides index.html defaults for non-home routes, then restores them on leave.
 */
export default function SeoHead({ title, description, canonicalPath, robots, jsonLd }: SeoHeadProps) {
  useEffect(() => {
    applyTags(title, description, absoluteUrl(canonicalPath), robots);
    setJsonLd(jsonLd);

    return () => {
      applyTags(HOME_TITLE, HOME_DESCRIPTION, SITE_URL, undefined);
      setJsonLd(undefined);
    };
  }, [title, description, canonicalPath, robots, jsonLd]);

  return null;
}
