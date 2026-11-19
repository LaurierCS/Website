import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import { loadConfig } from './lib/config';
import { SetupPage } from './pages/SetupPage';

const root = document.getElementById('root');
if (!root) throw new Error('index.html is missing <div id="root">.');

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
