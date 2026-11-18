import './styles/index.css';
import { QueryClient } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { createServices } from './app/services';
import { SetupScreen } from './app/SetupScreen';
import { loadConfig } from './shared/config';

const root = document.getElementById('root');
if (!root) throw new Error('index.html is missing <div id="root">.');

function startApp() {
  try {
    const services = createServices(loadConfig(import.meta.env), window.location.origin);
    return <App services={services} queryClient={new QueryClient()} />;
  } catch (error) {
    // The one error boundary for start-up: without config there is no app to render, so explain instead.
    return <SetupScreen problem={error instanceof Error ? error.message : String(error)} />;
  }
}

createRoot(root).render(<StrictMode>{startApp()}</StrictMode>);
