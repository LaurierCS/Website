/**
 * "Import CSV" on a list page, beside "Export CSV": it opens the list's import page, where nothing is saved until
 * the changes have been seen.
 */
import { Upload } from 'lucide-react';
import { ButtonLink } from './ButtonLink';

export function ImportCsvLink({ to }: { to: string }) {
  return (
    <ButtonLink to={to} variant="quiet" size="small" icon={<Upload aria-hidden="true" className="size-4" />}>
      Import CSV
    </ButtonLink>
  );
}
