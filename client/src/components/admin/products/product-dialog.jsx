import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BRANDS } from "@/features/admin/products/constants";
import { ColorPicker } from "./color-picker";
import { SizeSelector } from "./size-selector";
import { ImagePicker } from "./image-picker";
import { Button } from "@/components/ui/button";

const dialogContentClass = "max-h-[92vh] overflow-y-auto sm:max-w-4xl";

const contentWrapClass = "grid gap-6";

const twoColumnGridClass = "grid gap-4 md:grid-cols-2";

const threeColumnGridClass = "grid gap-4 md:grid-cols-3";

const fieldGroupClass = "space-y-2";

const sectionGridClass = "grid gap-6 md:grid-cols-2";

const statusGroupClass =
  "flex gap-6 rounded-xl border border-border bg-card px-4 py-3";

const statusItemClass = "flex items-center space-x-2";

const actionsRowClass = "flex justify-end gap-3";


export function ProductDialog({
open, onOpenChange, categories, product, onSaved
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={dialogContentClass}>
                <DialogHeader>
                    <dialogTitle>Add Product</dialogTitle>
                </DialogHeader>

                <div className={contentWrapClass}>
                    <div className={twoColumnGridClass}>
                        <div className={fieldGroupClass}>
                            <Label> Title </Label>
                            <Input
                            placeholder="Title"
                            />
                        </div>
                        <div className={fieldGroupClass}>
                            <Label> Brand </Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Brand"/>
                                </SelectTrigger>

                                <SelectContent>
                                    {
                                        BRANDS.map(brand=> (
                                            <SelectItem key={brand} value={brand}>
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className={fieldGroupClass}>
                        <Label> Description</Label>
                        <Textarea rows={5} placeholder="Description"/>
                    </div>
                    <div className={twoColumnGridClass}>
                        <div className={fieldGroupClass}>
                            <Label> Categories</Label>
                            <Select> 
                                <SelectTrigger>
                                    <SelectValue placeholder="Category"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        categories.map(category=>(
                                            <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>    

                        <div className={fieldGroupClass}>
                            <RadioGroup className={statusGroupClass}>
                                <div className={statusItemClass}>
                                    <RadioGroupItem value="active" id="product-status-active" />
                                    <Label htmlfor="product-status-active">Active</Label>
                                </div>
                                <div className={statusItemClass}>
                                    <RadioGroupItem value="inactive" id="product-status-inactive" />
                                    <Label htmlfor="product-status-inactive">Inactive</Label>
                                </div>

                            </RadioGroup>
                        
                        </div>                

                    </div>

                    <div className={threeColumnGridClass}>
                        <div className={fieldGroupClass}>
                            <Label>Price</Label>
                            <Input type="number" min="0" placeholder="0"/>
                        </div>
                        <div className={fieldGroupClass}>
                            <Label>Sale percentage</Label>
                            <Input type="number" min="0" placeholder="0"/>
                        </div>
                        <div className={fieldGroupClass}>
                            <Label>Stocks</Label>
                            <Input type="number" min="0" placeholder="0"/>
                        </div>

                    </div>
                    <div className={sectionGridClass}>
                        <ColorPicker/>
                        <SizeSelector/>
                    </div>
                    <ImagePicker/>

                    <div className={actionsRowClass}>
                        <Button variant='outline' onClick={() => onOpenChange(false)}> Cancel</Button>
                        <Button >Create product</Button>
                    </div>
                </div>
        
            </DialogContent>

        </Dialog>
    )
}