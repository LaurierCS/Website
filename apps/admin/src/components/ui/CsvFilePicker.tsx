/**
 * A button that opens the file browser for one CSV file and hands back the file chosen.
 */
import { Upload } from 'lucide-react';
import { type ButtonVariant, buttonClasses } from './button-styles';

type CsvFilePickerProps = {
  label: string;
  variant: ButtonVariant;
  disabled: boolean;
  onPick: (file: File) => void;
};

export function CsvFilePicker({ label, variant, disabled, onPick }: CsvFilePickerProps) {
  return (
    // The label is the button, so the whole of it opens the file browser; the input itself is hidden.
    <label
      className={`${buttonClasses(variant, 'small')} cursor-pointer focus-within:shadow-(--focus-ring) has-disabled:cursor-not-allowed has-disabled:opacity-60`}
    >
      <Upload aria-hidden="true" className="size-4" />
      {label}
      <input
        type="file"
        accept=".csv,text/csv"
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          // Clear it so choosing the same file again, after fixing it, still counts as a choice.
          event.target.value = '';
          if (file) onPick(file);
        }}
      />
    </label>
  );
}
