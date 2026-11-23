/**
 * The timing of the about window's group chat: someone is typing for a moment, their message lands, everyone
 * gets time to read it, then the next one starts typing, round and round. Each call to `nextStep` says what
 * happens next and how long it lasts, so the script that drives the chat only keeps time.
 */

/** Someone is typing a message, or a message has landed and is being read. */
export type ChatPhase = 'typing' | 'reading';

/** Which message the chat is on, and what is happening with it. */
export type ChatState = Readonly<{ message: number; phase: ChatPhase }>;

/** How many messages the page is sent with already posted, so the chat window starts full. */
export const POSTED_AT_START = 3;

/** The chat starts by reading the messages it was sent with. */
export const FIRST_STATE: ChatState = { message: POSTED_AT_START - 1, phase: 'reading' };

/** The first message says what LCS is, so it (and the opening of the page) gets the longest read. */
export const FIRST_READ_MS = 5000;

/** How long "… is typing" shows before a message lands: longer for longer messages, from 1.2 to 2.2 seconds. */
export function typingMs(text: string): number {
  return Math.min(2200, Math.max(1200, text.length * 25));
}

/** How long a message gets to be read before the next one starts typing: about 45 ms a letter, at least 3 s. */
export function readMs(text: string, index: number): number {
  return index === 0 ? FIRST_READ_MS : Math.max(3000, text.length * 45);
}

/** What happens after `state`, and how long it lasts. */
export function nextStep(
  state: ChatState,
  messages: readonly string[],
): Readonly<{ state: ChatState; waitMs: number }> {
  if (state.phase === 'reading') {
    const message = (state.message + 1) % messages.length;
    return { state: { message, phase: 'typing' }, waitMs: typingMs(messages[message]) };
  }
  return { state: { ...state, phase: 'reading' }, waitMs: readMs(messages[state.message], state.message) };
}

/**
 * Sent on `window` whenever someone starts or stops typing in the about window's chat. `detail` is who is typing,
 * or null while a message is being read. The clubhouse listens to show that mascot tapping, with a "…" bubble.
 */
export const TYPING_EVENT = 'lcs:typing';
