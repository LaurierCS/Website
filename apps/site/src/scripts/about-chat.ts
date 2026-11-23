/**
 * Runs the about window's group chat. The timing lives in `lib/chat.ts`; this keeps time, shows who is typing,
 * posts each message at the bottom (taking down the oldest ones that no longer fit), and tells the clubhouse who
 * is typing.
 * It pauses while the pause button is pressed (anything that keeps changing needs a way to stop it) and while
 * nobody can see it: the window off-screen or the tab hidden. With reduced motion it does nothing, so every
 * message the page was sent with stays on show.
 */
import { FIRST_READ_MS, FIRST_STATE, nextStep, TYPING_EVENT } from '../lib/chat';
import { requiredElement } from '../lib/dom';

/** Why the chat is paused. It runs only when there is no reason left. */
type PauseReason = 'button' | 'off-screen' | 'hidden-tab';

class AboutChat extends HTMLElement {
  connectedCallback(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const list = requiredElement<HTMLOListElement>(this, '[data-chat-messages]');
    const messages = [...list.querySelectorAll('li')];
    const texts = messages.map((message) => requiredElement(message, '[data-text]').textContent ?? '');
    const typingLines = [...this.querySelectorAll<HTMLElement>('[data-typing-line]')];
    const toggle = requiredElement<HTMLButtonElement>(this, '[data-chat-toggle]');

    let state = FIRST_STATE;
    let timer: number | undefined;
    let typist: string | null = null;
    // Starts off-screen until the observer below says the window can be seen.
    const reasons = new Set<PauseReason>(['off-screen']);

    // Show who is typing, and tell the clubhouse, only when it changes.
    const setTypist = (next: string | null): void => {
      if (next === typist) return;
      typist = next;
      for (const line of typingLines) line.toggleAttribute('data-active', line.dataset.typingLine === next);
      window.dispatchEvent(new CustomEvent<string | null>(TYPING_EVENT, { detail: next }));
    };

    // Post a message at the bottom (moving it there if it was posted last time round), then take down the oldest
    // until everything left fits, so no message is ever cut in half at the top.
    const post = (message: HTMLLIElement): void => {
      message.removeAttribute('data-posted');
      list.append(message);
      message.toggleAttribute('data-posted', true);
      // The list is pinned to the bottom, so a message that doesn't fit sticks out past its top edge.
      const top = list.getBoundingClientRect().top;
      let oldest = list.querySelector('li[data-posted]');
      while (oldest && oldest !== message && oldest.getBoundingClientRect().top < top) {
        oldest.removeAttribute('data-posted');
        oldest = list.querySelector('li[data-posted]');
      }
    };

    const tick = (): void => {
      const step = nextStep(state, texts);
      state = step.state;
      const message = messages[state.message];
      if (state.phase === 'typing') {
        setTypist(message.dataset.by ?? null);
      } else {
        setTypist(null);
        post(message);
      }
      timer = window.setTimeout(tick, step.waitMs);
    };

    const pause = (reason: PauseReason): void => {
      reasons.add(reason);
      window.clearTimeout(timer);
      timer = undefined;
      setTypist(null);
    };

    // Picks up where it left off, after a beat; the first time, the opening messages get the long first read.
    const resume = (reason: PauseReason): void => {
      reasons.delete(reason);
      if (reasons.size > 0 || timer !== undefined) return;
      const firstRun = state === FIRST_STATE;
      timer = window.setTimeout(tick, firstRun ? FIRST_READ_MS : 600);
    };

    const pauseWhile = (reason: PauseReason, paused: boolean): void => (paused ? pause(reason) : resume(reason));

    toggle.addEventListener('click', () => {
      const paused = !reasons.has('button');
      pauseWhile('button', paused);
      toggle.setAttribute('aria-pressed', String(paused));
      this.toggleAttribute('data-paused', paused);
    });
    document.addEventListener('visibilitychange', () => pauseWhile('hidden-tab', document.hidden));
    new IntersectionObserver(([entry]) => pauseWhile('off-screen', !entry?.isIntersecting)).observe(this);

    // Shows the pause button, which is useless until the chat runs.
    this.toggleAttribute('data-live', true);
  }
}

customElements.define('about-chat', AboutChat);
