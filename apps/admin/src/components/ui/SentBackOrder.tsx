/**
 * A print order that came back: the file had problems, so nothing was imported. The order is stamped "Sent back"
 * and lists every problem by row, and the empty press says what to do next.
 */
import type { ReactNode } from 'react';
import type { ImportProblem } from '../../lib/csv/csv-import';
import { ImportProblems } from './ImportProblems';
import { OrderRule } from './OrderRule';
import { OrderTotal } from './OrderTotal';
import { PrintOrder } from './PrintOrder';
import { StateBlock } from './StateBlock';

type SentBackOrderProps = {
  fileName: string;
  problems: readonly ImportProblem[];
  /** The button to choose the fixed file. */
  picker: ReactNode;
};

export function SentBackOrder({ fileName, problems, picker }: SentBackOrderProps) {
  const one = problems.length === 1;
  return (
    <>
      <PrintOrder fileName={fileName} stamp="Sent back">
        <ImportProblems problems={problems} />
        <OrderRule />
        <OrderTotal label="Can't print yet" value={one ? '1 problem' : `${problems.length} problems`} />
        {picker}
        <p className="text-center text-xs text-ink-2">Nothing was saved.</p>
      </PrintOrder>
      <StateBlock
        tone="failed"
        mascot="doug"
        title="The press won't run this one."
        body={`${fileName} has ${one ? 'a problem' : `${problems.length} problems`}, listed on the order by row. Fix ${one ? 'it' : 'them'} in your spreadsheet, save it as CSV, then choose it again.`}
        action={null}
      />
    </>
  );
}
