/**
 * Where a link opens. Links that leave the site (the club's accounts, a speaker's LinkedIn, the sign-up form)
 * open in a new tab, so the club's page stays open behind them; links to a part of this page (`#events`) open in
 * place.
 */

/** The attributes for a link to `href`: a new tab for a full web address, nothing for a link within the site. */
export function linkTarget(href: string): Readonly<{ target?: '_blank'; rel?: string }> {
  // Only a full address (https://…) parses without a base; `#events` and `/about` don't.
  return URL.canParse(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}
