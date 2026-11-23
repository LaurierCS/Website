/**
 * Finding the elements a page script needs inside its component's markup.
 */

/** The element `selector` finds inside `root`. Missing means the markup and the script disagree, so it throws. */
export function requiredElement<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Expected to find ${selector} in the page, but it is missing.`);
  return element;
}
