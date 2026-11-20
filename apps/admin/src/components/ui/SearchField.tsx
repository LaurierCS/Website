/**
 * A labelled search box with a magnifier and, once something is typed, a button that clears it and puts the
 * cursor back in the box.
 */
import { Search, X } from 'lucide-react';
import { useId, useRef } from 'react';

type SearchFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export function SearchField({ label, placeholder, value, onChange }: SearchFieldProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label htmlFor={id} className="font-display text-lg font-bold">
        {label}
      </label>
      <div className="relative mt-2">
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
        <input
          ref={input}
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="block min-h-13 w-full rounded-field border-2 border-line bg-slate px-12 text-white placeholder:text-muted"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear"
            onClick={() => {
              onChange('');
              input.current?.focus();
            }}
            className="absolute top-1/2 right-1 grid size-11 -translate-y-1/2 place-items-center rounded-full text-text-2 transition-colors duration-150 hover:text-white"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
}
