/**
 * "Export CSV" on a list page. It is off until the list has loaded, so it can't save an empty file because the
 * list failed or hadn't arrived yet.
 */
import { Download } from 'lucide-react';
import type { CsvFile } from '../../lib/csv/csv-formats';
import { downloadFile } from '../../lib/other/download';
import { Button } from './Button';

type ExportCsvButtonProps = {
  /** Builds the file when pressed; null while there is nothing ready to export. */
  getFile: (() => CsvFile) | null;
};

export function ExportCsvButton({ getFile }: ExportCsvButtonProps) {
  return (
    <Button
      variant="quiet"
      size="small"
      icon={<Download aria-hidden="true" className="size-4" />}
      disabled={getFile === null}
      onClick={() => getFile && downloadFile(getFile())}
    >
      Export CSV
    </Button>
  );
}
