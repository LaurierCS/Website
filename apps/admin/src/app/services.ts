/**
 * The composition root: the only place that builds concrete adapters. Features reach them
 * through `useServices()`, so tests can hand in typed fakes instead. The provider is in `ServicesProvider.tsx`.
 */
import { createClient } from '@supabase/supabase-js';
import { createContext, use } from 'react';
import type { AuthGateway, EventReader } from '../domain/ports';
import type { Database } from '../infra/database.types';
import { SupabaseAuthGateway } from '../infra/supabase-auth-gateway';
import { SupabaseEventReader } from '../infra/supabase-event-reader';
import type { AppConfig } from '../shared/config';
import { PATHS } from './paths';

export type Services = Readonly<{
  auth: AuthGateway;
  events: EventReader;
}>;

export function createServices(config: AppConfig, origin: string): Services {
  // One client for the whole app, typed by the generated database types.
  const client = createClient<Database>(config.supabaseUrl, config.supabaseAnonKey);
  return {
    auth: new SupabaseAuthGateway(client, new URL(PATHS.login, origin).toString()),
    events: new SupabaseEventReader(client),
  };
}

export const ServicesContext = createContext<Services | null>(null);

/** The app's services. Only valid inside `ServicesProvider`. */
export function useServices(): Services {
  const services = use(ServicesContext);
  if (!services) throw new Error('useServices() was called outside <ServicesProvider>.');
  return services;
}
