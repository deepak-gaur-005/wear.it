import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    createAdminCategory,
    deleteAdminCategory,
    updateAdminCategory,
} from "@/features/admin/products/api";
import { Pencil, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";



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
    const [saving, setSaving] = useState(false);
    const [deletingCategoryId, setDeletingCategoryId] = useState("");

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
            toast.success(editingCategory ? "Category updated" : "Category created");
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to save category"
            );
        } finally {
            setSaving(false);
        }
    }
    
    function handleEdit(getCurrentCategory){
        setEditingCategory(getCurrentCategory)
        setName(getCurrentCategory.name)
    }

    async function handleDelete(category) {
        if (!window.confirm(`Delete the "${category.name}" category?`)) return;

        try {
            setDeletingCategoryId(category._id);
            await deleteAdminCategory(category._id);
            if (editingCategory?._id === category._id) {
                setEditingCategory(null);
                setName("");
            }
            await onSaved();
            toast.success("Category deleted");
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to delete category"
            );
        } finally {
            setDeletingCategoryId("");
        }
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
                                <div className="flex items-center gap-2">
                                    <Tag className={categoryIcon}/>
                                    <span className={categoryName}>{cat.name}</span>
                                </div>

                                <div className="flex items-center">
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleEdit(cat)}
                                        disabled={Boolean(deletingCategoryId)}
                                        aria-label={`Edit category ${cat.name}`}
                                    >
                                        <Pencil className={editButtonClass}/>
                                    </Button>
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => void handleDelete(cat)}
                                        disabled={Boolean(deletingCategoryId)}
                                        aria-label={`Delete category ${cat.name}`}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className={editButtonClass}/>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}