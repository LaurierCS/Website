/**
 * What shows when a page crashes or can't be loaded, instead of React Router's developer error page: Doug, what
 * happened, and a button to reload.
 */
import { RotateCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { StateBlock } from '../ui/StateBlock';

export function RouteError() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <StateBlock
        tone="failed"
        mascot="doug"
        title="This page didn't open."
        body="Reload to try again. If it keeps happening, tell the eng team in the LCS Discord what you clicked."
        action={
          <Button
            variant="primary"
            size="small"
            icon={<RotateCw aria-hidden="true" className="size-4" />}
            onClick={() => window.location.reload()}
          >
            Reload
          </Button>
        }
      />
    </main>
  );
}
