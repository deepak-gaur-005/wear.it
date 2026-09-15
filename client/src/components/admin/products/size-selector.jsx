import { Button } from "@/components/ui/button";
import { SIZE_OPTIONS } from "@/features/admin/products/constants";


const wrapperClass = "space-y-3";

const headerClass = "space-y-1";

const titleClass = "text-sm font-semibold text-foreground";

const descriptionClass = "text-sm text-muted-foreground";

const gridClass = "grid grid-cols-4 gap-2";

const sizeButtonClass = "h-11";

export function SizeSelector(){

    return (
        <div className={wrapperClass}>
            <div className={headerClass}>
                <h3 className={titleClass}>Colors</h3>
            </div>
            <div className={gridClass}>
                {
                    SIZE_OPTIONS.map(sizeItem=> {
                        return <Button
                        key={sizeItem}
                        type="button"
                        variant="outline"
                        >{sizeItem}</Button>
                    })
                }
            </div>
        </div>
    );
}
