import { useEffect, useState } from "react"


function getEmptyForm(){

    return {
        newFiles: [],
        coverImagePublicId: "",
    }
}


export function getCoverImage(){
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
    open,
    onclose,
    onSaved,
    product
}) {
    const [form, setform] = useState(getEmptyForm())
    const [saving, setSaving] = useState(false)

    useEffect(()=> {

        setform(
            product
                ?mapProductToFormValues(product)
                : getEmptyForm()
        )
    },[open, product]);

    function toggleSize(size){
        setform((prev) => ({
            ...prev,
            sizes: prev.sizes.includes(sizes)
                ? prev.sizes.filter((item)=> item !== size)
                : [...prev.sizes, size],
        }))

    }

    function addColor(color){
        setform((prev) => ({
            ...prev,
            colors : prev.colors.includes(color)
            ? prev.colors
            : [...prev.colors, color]
        }))
    }

    function removeColor(color){
        setform((prev) => ({
            ...prev,
            colors : prev.colors.filter((item) => item !== color),
        }))
    }

}