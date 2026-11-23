/**
 * Whoever is typing in the about window's chat nods at the keys with a "…" bubble over their head, and the
 * laptop they share looks busy; all of it stops while a message is being read. The chat says who is typing with
 * `TYPING_EVENT`.
 */
import { TYPING_EVENT } from '../lib/chat';

const bubbles = [...document.querySelectorAll<HTMLElement>('[data-typing-bubble]')];
const movers = [...document.querySelectorAll<HTMLElement>('[data-typist]')];

/**
 * Starts a looping move, or lets it finish the loop it is on before stopping, so it eases back to rest instead
 * of snapping there.
 */
function setMoving(element: HTMLElement, moving: boolean): void {
  if (moving) {
    element.removeAttribute('data-stopping');
    element.toggleAttribute('data-typing', true);
    return;
  }
  if (!element.hasAttribute('data-typing') || element.hasAttribute('data-stopping')) return;
  element.toggleAttribute('data-stopping', true);
  element.addEventListener(
    'animationiteration',
    () => {
      // Started again before the loop ended: keep going.
      if (!element.hasAttribute('data-stopping')) return;
      element.removeAttribute('data-stopping');
      element.removeAttribute('data-typing');
    },
    { once: true },
  );
}

window.addEventListener(TYPING_EVENT, (event) => {
  const typist = event instanceof CustomEvent ? event.detail : null;
  for (const bubble of bubbles) bubble.toggleAttribute('data-active', bubble.dataset.typingBubble === typist);
  for (const mover of movers) {
    const mine = mover.dataset.typist === typist || (mover.dataset.typist === 'anyone' && typist !== null);
    setMoving(mover, mine);
  }
});
