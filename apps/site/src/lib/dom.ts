/**
 * Finding the elements a page script needs inside its component's markup.
 */

/**
 * The `data-<name>` value the markup gives `element`. Missing means the markup and the script disagree, so it
 * throws.
 */
export function requiredData(element: HTMLElement, name: string): string {
  const value = element.dataset[name];
  if (value === undefined) throw new Error(`Expected data-${name} on ${element.tagName}, but it is missing.`);
  return value;
}

/** The element `selector` finds inside `root`. Missing means the markup and the script disagree, so it throws. */
export function requiredElement<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Expected to find ${selector} in the page, but it is missing.`);
  return element;
}
