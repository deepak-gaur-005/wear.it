import { useState } from "react"
import { createAdminProduct, updateAdminProduct } from "./api"
import {
    MAX_PRODUCT_IMAGES,
    addProductImages,
    removeProductImage,
} from "./image-files";

function getEmptyForm(){

    return {
        title: "",
        description: "",
        category: "",
        brand: "",
        colors: [],
        sizes: [],
        price: "",
        salePercentage: "0",
        stock: "0",
        status: "active",
        existingImages: [],
        newFiles: [],
        coverImagePublicId: "",
    }
}


export function getCoverImage(images){
    return images.find(img=> img.isCover) ?? images[0]
}


function  mapProductToFormValues(product){

    const cover = getCoverImage(product.images)

    return {
        title: product.title,
        description: product.description,
        category: product.category._id,
        brand: product.brand,
        colors: product.colors ?? [],
        sizes: product.sizes ?? [],
        price: String(product.price),
        salePercentage: String(product.salePercentage ?? 0),
        stock: String(product.stock),
        status: product.status,
        existingImages: product.images ?? [],
        newFiles: [],
        coverImagePublicId: cover?.publicId ?? "",    
    }
}

export function useProductform({
    onClose,
    onSaved,
    product
}) {
    const [form, setForm] = useState(() =>
        product ? mapProductToFormValues(product) : getEmptyForm()
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function toggleSize(size){
        setForm((prev) => {
        const sizes = Array.isArray(prev.sizes) ? prev.sizes : [];
        return {
            ...prev,
            sizes: sizes.includes(size)
                ? sizes.filter((item) => item !== size)
                : [...sizes, size],
      };
    });

    }

    // function addColor(color){
    //     setForm((prev) => ({
    //         ...prev,
    //         colors : prev.colors.includes(color)
    //         ? prev.colors
    //         : [...prev.colors, color]
    //     }))
    // }

    function addColor(color) {
        setForm((prev) => ({
            ...prev,
            colors: prev.colors.includes(color)
            ? prev.colors
            : [...prev.colors, color],
        }));
    }

    function removeColor(color){
        setForm((prev) => ({
            ...prev,
            colors : prev.colors.filter((item) => item !== color),
        }))
    }

    function addFiles(files){
        if(!files?.length) return;

        const selectedFiles = Array.from(files);
        const selection = addProductImages(
            form.newFiles,
            selectedFiles
        );

        if (selection.exceededLimit) {
            setError(`You can select up to ${MAX_PRODUCT_IMAGES} images.`);
        } else {
            setError("");
        }

        if (selection.files.length === form.newFiles.length) return;

        setForm((prev) => ({
            ...prev,
            newFiles: selection.files,
        }))
    }

    function removeNewFile(fileIndex) {
        setError("");
        setForm((prev) => ({
            ...prev,
            newFiles: removeProductImage(prev.newFiles, fileIndex),
        }));
    }

    function updateField(key, value) {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    function removeExistingImage(publicId){
        setForm(prev => {
            const nextImages = prev.existingImages.filter(
                image => image.publicId !== publicId
            ) 
            const nextCover = prev.coverImagePublicId === publicId ? 
            (nextImages[0]?.publicId ?? ""): prev.coverImagePublicId;

            return {
                ...prev, //always return previous state 
                existingImages: nextImages,
                coverImagePublicId: nextCover,
            }
        })
        
    }
    function changeCoverImage(publicId){
        updateField('coverImagePublicId', publicId);
    }

    async function submit() {

        if (!form.title.trim() || !form.description.trim() || !form.category.trim()) {
            setError("Title, description, and category are required.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            if (product){
                //edit
                await updateAdminProduct(
                    product._id,
                    {
                        title: form.title.trim(), 
                        description: form.description.trim(), 
                        category: form.category, 
                        brand: form.brand, 
                        colors: form.colors, 
                        sizes: form.sizes, 
                        price: Number(form.price), 
                        salePercentage: Number(form.salePercentage) || 0, 
                        stock: Number(form.stock), 
                        status: form.status, 
                        existingImages: form.existingImages, 
                        coverImagePublicId: form.coverImagePublicId || undefined,
                        
                    },
                    form.newFiles

                )
            }else {
                //update
                await createAdminProduct(
                    {
                        title: form.title.trim(), 
                        description: form.description.trim(), 
                        category: form.category, 
                        brand: form.brand, colors: 
                        form.colors, sizes: form.sizes, 
                        price: Number(form.price), 
                        salePercentage: Number(form.salePercentage) || 0, 
                        stock: Number(form.stock), 
                        status: form.status,
                    },
                    form.newFiles
                )
            }

            await onSaved();
            onClose();
        } catch (saveError) {
            console.error("Failed to save product:", saveError);
            setError(
                saveError instanceof Error
                    ? saveError.message
                    : "Failed to save product"
            );
        } finally {
            setSaving(false);
        }
    }
    return {
            form,
            saving,
            error,
            isEditMode : !!product,
            toggleSize,
            addColor,
            removeColor,
            addFiles,
            submit,
            updateField,
            removeExistingImage,
            removeNewFile,
            changeCoverImage

        }
}