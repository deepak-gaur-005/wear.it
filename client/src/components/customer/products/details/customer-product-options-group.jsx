import { getSwatchColor } from "@/features/customer/products/product-list-shared";

const groupClass = "space-y-3";

const labelClass = "block text-sm font-medium text-foreground";

const wrapClass = "flex flex-wrap gap-2";

const baseButtonClass =
  "inline-flex items-center justify-center gap-2 border px-4 py-2 text-sm font-medium transition";

const activeButtonClass =
  "border-primary bg-primary/15 text-primary ring-2 ring-primary/20";

const inactiveButtonClass =
  "border-border bg-secondary text-secondary-foreground hover:border-primary/40";

const sizeButtonClass = "min-w-12 rounded-none";

const colorButtonClass = "rounded-none";

const swatchClass = "h-4 w-4 border border-border";

function CustomerProductOptionsGroup({
  values,
  variant,
  label,
  selectedValue,
  onSelect,
}) {
  return (
    <div className={groupClass}>
      <span className={labelClass}>{label}</span>
      <div role="group" aria-label={label} className={wrapClass}>
        {values.map((value) => {
          const isActive = selectedValue === value;

          return (
            <button
              key={value}
              type="button"
              aria-label={variant === "color" ? `Color ${value}` : value}
              aria-pressed={isActive}
              onClick={() => onSelect(value)}
              className={`${baseButtonClass} ${
                variant === "color" ? colorButtonClass : sizeButtonClass
              } ${isActive ? activeButtonClass : inactiveButtonClass}`}
            >
              {variant === "color" ? (
                <>
                  <span
                    aria-hidden="true"
                    className={swatchClass}
                    style={{ backgroundColor: getSwatchColor(value) }}
                  />
                  <span>{value}</span>
                </>
              ) : (
                value
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CustomerProductOptionsGroup;
