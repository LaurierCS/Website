import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import { loadConfig } from './lib/config/config';
import { reloadForUpdate } from './lib/other/update-reload';
import { SetupPage } from './pages/SetupPage';

const root = document.getElementById('root');
if (!root) throw new Error('index.html is missing <div id="root">.');

// Vite fires this when a page's file can't be loaded, which after a deploy means the tab is on the old version.
// Reloading gets the new one; when it doesn't reload, the error carries on to the error screen.
window.addEventListener('vite:preloadError', (event) => {
  if (reloadForUpdate(() => window.location.reload())) event.preventDefault();
});

/** The app, or the setup page when the `.env` is missing or wrong. */
function startPage() {
  try {
    loadConfig();
  } catch (error) {
    return <SetupPage problem={error instanceof Error ? error.message : String(error)} />;
  }
  return <App />;
}

createRoot(root).render(<StrictMode>{startPage()}</StrictMode>);
