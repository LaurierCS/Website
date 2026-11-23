/**
 * Opens and closes the phone menu. The <dialog> already closes on Escape and keeps focus inside; this adds the
 * Menu and Close buttons, closing when a page link is followed, and closing on a tap outside the menu.
 */

/** The element a selector must find inside the menu's markup. Missing means the markup and script disagree. */
function required<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`The site menu is missing ${selector}.`);
  return element;
}

class SiteMenu extends HTMLElement {
  connectedCallback(): void {
    const dialog = required<HTMLDialogElement>(this, 'dialog');
    required<HTMLButtonElement>(this, '[data-menu-open]').addEventListener('click', () => dialog.showModal());
    required<HTMLButtonElement>(this, '[data-menu-close]').addEventListener('click', () => dialog.close());

    dialog.addEventListener('click', (event) => {
      // A click on the dialog itself, not on anything in it, is a tap on the dimmed page around the menu.
      const followedPageLink = event.target instanceof Element && event.target.closest('a[href^="#"]');
      if (event.target === dialog || followedPageLink) dialog.close();
    });
  }
}

customElements.define('site-menu', SiteMenu);
