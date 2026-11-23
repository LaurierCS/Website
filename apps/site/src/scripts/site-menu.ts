/**
 * Opens and closes the phone menu. The <dialog> already closes on Escape and keeps focus inside; this adds the
 * Menu and Close buttons, closing when a page link is followed, and closing on a tap outside the menu.
 */
import { requiredElement } from '../lib/dom';

class SiteMenu extends HTMLElement {
  connectedCallback(): void {
    const dialog = requiredElement<HTMLDialogElement>(this, 'dialog');
    const openButton = requiredElement<HTMLButtonElement>(this, '[data-menu-open]');
    const closeButton = requiredElement<HTMLButtonElement>(this, '[data-menu-close]');
    openButton.addEventListener('click', () => dialog.showModal());
    closeButton.addEventListener('click', () => dialog.close());

    dialog.addEventListener('click', (event) => {
      // A click on the dialog itself, not on anything in it, is a tap on the dimmed page around the menu.
      const followedPageLink = event.target instanceof Element && event.target.closest('a[href^="#"]');
      if (event.target === dialog || followedPageLink) dialog.close();
    });
  }
}

customElements.define('site-menu', SiteMenu);
