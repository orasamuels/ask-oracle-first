import { cn } from "@/lib/utils";

interface Option<T> {
  value: T;
  label: string;
  disabled?: boolean | undefined;
  hint?: string | undefined;
}

interface OptionGroupProps<T extends string | number> {
  label: string;
  options: Option<T>[];
  value?: T | undefined;
  onChange: (v: T) => void;
  columns?: string;
}

/** Reusable single-choice selector rendered as a grid of buttons. */
export function OptionGroup<T extends string | number>({ label, options, value, onChange, columns = "grid-cols-3" }: OptionGroupProps<T>) {
  return (
    <fieldset>
      <legend className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</legend>
      <div role="radiogroup" aria-label={label} className={cn("mt-3 grid gap-2", columns)}>
        {options.map((o) => {
          const selected = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={o.disabled}
              onClick={() => onChange(o.value)}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                selected
                  ? "border-primary bg-primary/15 text-foreground shadow-glow"
                  : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              <span className="block font-medium">{o.label}</span>
              {o.hint && <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wider text-accent">{o.hint}</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
