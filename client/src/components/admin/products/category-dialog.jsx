import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createAdminCategory, updateAdminCategory } from "@/features/admin/products/api";
import { Pencil, Tag } from "lucide-react";
import { useState } from "react";



const dialogContentClass = "sm:max-w-xl";

const contentWrap = "space-y-4";

const formRow = "flex gap-3";

const categoriesList = "space-y-2";

const categoryRow =
  "flex items-center justify-between rounded-xl border border-border bg-card px-3 py-3";

const categoryIcon = "h-4 w-4 text-muted-foreground";

const categoryName = "text-sm font-medium text-foreground";

const editButtonClass = "h-4 w-4";



export function CategoryDialog({
    open, onOpenChange, categories,onSaved,
}){
    const [name, setName] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [saving, setSaving] = useState(false)

    async function handleSave() {
        if(!name.trim()) return;

        try{
            setSaving(true);

            if(editingCategory){
                await updateAdminCategory(editingCategory._id, { name: name.trim() });
            }
            else {
                await createAdminCategory({name : name.trim()})
            }

            setName("");
            setEditingCategory(null);
            await onSaved();
        }finally{
            setSaving(false);
        }
    }
    
    function handleEdit(getCurrentCategory){
        setEditingCategory(getCurrentCategory)
        setName(getCurrentCategory.name)
    }

    function handleClose(nextOpen){
        if(!nextOpen){
            setName("")
            setEditingCategory(null)
        }

        onOpenChange(nextOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className={dialogContentClass}>
                <DialogHeader>
                    <DialogTitle>Manage Categories</DialogTitle>
                </DialogHeader>

                <div className={contentWrap}>
                    <div className={formRow}>
                        <Input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Enter category name you want to add!!!"
                        />
                        <Button onClick={handleSave} disabled={saving || !name.trim()}>
                            {editingCategory ? "Update" : "Add"}
                        </Button>
                    </div>

                    <Separator/>

                    <div className={categoriesList}>
                        {categories.map((cat) => (
                            <div key={cat._id} className={categoryRow}>
                                <div key={cat._id} className={categoryRow}>
                                    <Tag className={categoryIcon}/>
                                    <span className={categoryName}>{cat.name}</span>
                                </div>

                                <Button
                                type="button"
                                size="icon"
                                variant='ghost'
                                onClick={() => handleEdit(cat)}
                                >
                                    <Pencil className={editButtonClass}/>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}