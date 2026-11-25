// v2 step 4: copy each event's current picture from `events-images` into `event-media/<event_id>/photos/`.
//
// Run after 03_populate.sql, from your own computer (never in the browser or CI):
//
//   SUPABASE_URL=https://<project>.supabase.co SUPABASE_ANON_KEY=... SUPABASE_SERVICE_ROLE_KEY=... \
//     node supabase/v2/04_copy_event_photos.mjs
//
// The event list is read with the anon key (events are public, and service_role has no grant on public.events);
// the files are copied with the service role key. Without SUPABASE_ANON_KEY it tries the service role key.
//
// Add --dry-run to only print what it would copy. Needs Node 18+ and no packages.
//
// Copies, never moves: `events-images` stays exactly as it is for the live site. Safe to run again; files that
// are already in event-media are skipped. The paths match the ones 03_populate.sql wrote to v2.event_photos:
// spaces in a file name become dashes ("meet%20the%20pros.png" is copied as "meet-the-pros.png").

const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const readKey = process.env.SUPABASE_ANON_KEY || key;
const dryRun = process.argv.includes('--dry-run');

if (!url || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const auth = { apikey: key, Authorization: `Bearer ${key}` };

const res = await fetch(`${url}/rest/v1/events?select=id,title,picture_url&picture_url=not.is.null`, {
  headers: { apikey: readKey, Authorization: `Bearer ${readKey}` },
});
if (!res.ok) throw new Error(`Reading events failed: ${res.status} ${await res.text()}`);
const events = await res.json();

let copied = 0;
let skipped = 0;
let failed = 0;

for (const event of events) {
  const file = event.picture_url.match(/\/events-images\/(.+)$/)?.[1];
  if (!file) {
    console.warn(`skip  ${event.title}: picture isn't in events-images (${event.picture_url})`);
    skipped++;
    continue;
  }

  const target = `${event.id}/photos/${decodeURIComponent(file).replace(/\s+/g, '-')}`;

  const exists = await fetch(`${url}/storage/v1/object/info/event-media/${target}`, { headers: auth });
  if (exists.ok) {
    console.log(`have  ${target}`);
    skipped++;
    continue;
  }

  if (dryRun) {
    console.log(`would copy  events-images/${file} -> event-media/${target}`);
    continue;
  }

  const source = await fetch(`${url}/storage/v1/object/events-images/${file}`, { headers: auth });
  if (!source.ok) {
    console.error(`fail  ${event.title}: download ${source.status}`);
    failed++;
    continue;
  }

  const upload = await fetch(`${url}/storage/v1/object/event-media/${target}`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': source.headers.get('content-type') ?? 'application/octet-stream' },
    body: Buffer.from(await source.arrayBuffer()),
  });
  if (!upload.ok) {
    console.error(`fail  ${event.title}: upload ${upload.status} ${await upload.text()}`);
    failed++;
    continue;
  }

  console.log(`copy  ${target}`);
  copied++;
}

console.log(`\n${copied} copied, ${skipped} skipped, ${failed} failed${dryRun ? ' (dry run)' : ''}.`);
process.exit(failed ? 1 : 0);
