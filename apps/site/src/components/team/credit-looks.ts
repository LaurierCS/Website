/**
 * How the team's prints look on the credits: each hangs a little crooked, by its place, so no two neighbours lean
 * the same way, and someone without a photo gets their initials on one of the accents.
 */
export const PRINT_TILTS = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', 'rotate-0', '-rotate-2'] as const;

/** The colour behind someone's initials, fading into the slate. */
export const INITIALS_FILLS = ['from-blue', 'from-pink', 'from-yellow', 'from-orange', 'from-sky'] as const;
