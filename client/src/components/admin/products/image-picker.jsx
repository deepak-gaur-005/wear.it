import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";

const wrapperClass = "space-y-4";

const headerClass = "space-y-1";

const titleClass = "text-sm font-semibold text-foreground";

const descriptionClass = "text-sm text-muted-foreground";

const uploadLabelClass =
  "flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center transition hover:bg-muted";

const uploadIconClass = "mb-2 h-5 w-5 text-muted-foreground";

const uploadTitleClass = "text-sm font-medium text-foreground";

const uploadSubtitleClass = "mt-1 text-xs text-muted-foreground";

const hiddenInputClass = "hidden";

const sectionClass = "space-y-2";

const sectionTitleClass = "text-sm font-medium text-foreground";

const gridClass = "grid grid-cols-2 gap-3 md:grid-cols-4";

const imageCardClass =
  "overflow-hidden rounded-xl border border-border bg-card";

const imageClass = "h-28 w-full object-cover";

const imageActionsClass = "flex items-center justify-between gap-2 p-2";

const starIconClass = "mr-1 h-3.5 w-3.5";

const removeIconClass = "h-4 w-4";

const fileNameClass = "p-2 text-xs text-muted-foreground";

export function ImagePicker(){

    return (
        <div className={wrapperClass}>
            <div className={headerClass}>
                <h3 className={titleClass}>Images</h3>
            </div>
            <Label className={uploadLabelClass}>
                <ImagePlus className={uploadIconClass}/>
                <span className={uploadTitleClass}>Upload Product Images</span>
                
                <Input
                    type="file"
                    accept="image/*"
                    multiple
                    className={hiddenInputClass}
                />
            </Label>
        </div>
    );
}