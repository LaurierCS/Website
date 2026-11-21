/** The how-to guide for execs, linked from the admin's top bar. It lives in the repository's docs on GitHub. */
import { BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { buttonClasses, KEY_PRESS } from '../ui/button-styles';

const GUIDE_URL = 'https://github.com/LaurierCS/Website/blob/main/docs/admin-guide.md';

export function GuideLink() {
  return (
    <motion.a
      {...KEY_PRESS}
      href={GUIDE_URL}
      target="_blank"
      rel="noreferrer"
      title="How-to guide"
      // Names the link even when only the icon shows, and says it opens a new tab.
      aria-label="Guide (opens in a new tab)"
      className={buttonClasses('quiet', 'small')}
    >
      <BookOpen aria-hidden="true" className="size-4" />
      {/* Below the `header` breakpoint the link is just the icon, like Sign out. */}
      <span className="sr-only header:not-sr-only">Guide</span>
    </motion.a>
  );
}
