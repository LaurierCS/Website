import { createContext, useContext } from 'react';
import type Lenis from 'lenis';

export interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { offset?: number; immediate?: boolean; duration?: number }
  ) => void;
}

export const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);
