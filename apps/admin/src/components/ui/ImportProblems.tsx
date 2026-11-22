/**
 * Why a CSV file can't be imported: every problem, by the row a spreadsheet shows, so it can be fixed in one go.
 */
import type { ImportProblem } from '../../lib/csv-import';

type ImportProblemsProps = {
  fileName: string;
  problems: readonly ImportProblem[];
};

export function ImportProblems({ fileName, problems }: ImportProblemsProps) {
  return (
    <div role="alert" className="rounded-card border-2 border-dashed border-danger-soft bg-slate p-6">
      <h2 className="text-2xl font-extrabold">{fileName} can't be imported yet.</h2>
      <p className="mt-1 text-text-2">Fix these in the file, then choose it again. Nothing was saved.</p>
      <ul className="mt-4 grid gap-2">
        {problems.map(({ rowNumber, message }, index) => (
          // Problems have no id of their own, and one row can have several.
          <li key={index}>
            {rowNumber !== null && <span className="font-display font-bold text-danger-soft">Row {rowNumber}</span>} {message}
          </li>
        ))}
      </ul>
    </div>
  );
}
