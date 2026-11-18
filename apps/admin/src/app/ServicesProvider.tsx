/** Hands the app's services to every screen below it; read them with `useServices()`. */
import type { ReactNode } from 'react';
import { type Services, ServicesContext } from './services';

export function ServicesProvider({ services, children }: { services: Services; children: ReactNode }) {
  return <ServicesContext value={services}>{children}</ServicesContext>;
}
