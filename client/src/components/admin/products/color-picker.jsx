import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const wrapperClass = "space-y-3";

const headerClass = "space-y-1";

const titleClass = "text-sm font-semibold text-foreground";

const descriptionClass = "text-sm text-muted-foreground";

const actionsRowClass = "flex flex-wrap items-center gap-3";

const colorInputClass = "h-11 w-16 rounded-lg p-1";

const colorsListClass = "flex flex-wrap gap-2";

const colorChipClass =
  "group inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground transition hover:bg-muted";

const colorDotClass = "h-4 w-4 rounded-full border border-black/10";

const removeIconClass =
  "h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground";


export function ColorPicker(){

    return (
        <div className={wrapperClass}>
            <div className={headerClass}>
                <h3 className={titleClass}>Colors</h3>
            </div>

            <div className={actionsRowClass}>
                <Input
                type="color"
                className={colorInputClass}
                />

                <Button type="button" variant="secondary">
                    Add Color
                </Button>
            </div>
        </div>
    )
}