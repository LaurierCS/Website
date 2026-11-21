/**
 * An on/off switch, like showing a member on the site. The knob springs across and the words beside it say the
 * new state. Where flipping it saves straight away (a member's badge), `saving` makes it say "Saving…" and wait.
 */

type SwitchProps = {
  checked: boolean;
  saving: boolean;
  /** What it switches, read out by screen readers, e.g. "Show Sam Rivera on the site". */
  label: string;
  /** The words shown beside it for the current state, e.g. "On the site" or "Hidden". */
  stateText: string;
  onChange: (checked: boolean) => void;
};

export function Switch({ checked, saving, label, stateText, onChange }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={saving}
      onClick={() => onChange(!checked)}
      className="inline-flex min-h-11 items-center gap-3 rounded-full pr-2 font-display font-bold disabled:cursor-wait"
    >
      <span
        aria-hidden="true"
        className={`flex h-8 w-14 shrink-0 items-center rounded-full border-2 p-0.5 transition-colors duration-150 ${
          checked ? 'border-sky bg-sky' : 'border-line bg-slate'
        } ${saving ? 'opacity-70' : ''}`}
      >
        <span
          className={`size-6 rounded-full transition-transform duration-(--dur-base) ease-(--ease-spring) motion-reduce:transition-none ${
            checked ? 'translate-x-6 bg-deep' : 'bg-muted'
          }`}
        />
      </span>
      {/* A fixed width, so switching between the words doesn't shift the buttons next to it. */}
      <span className={`w-24 text-left ${checked ? 'text-white' : 'text-text-2'}`}>{saving ? 'Saving…' : stateText}</span>
    </button>
  );
}
