import { apiGet, apiPost, apiPut } from "@/lib/api"

/*category api */

export async function getAdminCategories(){
    return apiGet("/admin/categories")
} //No request body is needed because we are only asking the server to send existing categories.

export async function createAdminCategory(body){
    return apiPost("/admin/categories", body)
} //creating new resources

export async function updateAdminCategory(categoryId, body){

    return apiPut(`/admin/categories/${categoryId}`, body)
} // categoryId tells the backend WHICH category to update

/* products */

export async function getAdminProducts(search) {  // search is optional
    const query = search?.trim() ?
    `/admin/products?search=${encodeURIComponent(search.trim())}` : //encodeURIComponent() converts characters(spaces, &, ?,/) into a URL-safe format
    `/admin/products`
    return apiGet(query)
} // fetch products from admin panel

export async function getAdminProductById(productId) {
  return apiGet(`/admin/products/${productId}`);
} // to fetch ONE product

// product from data

function buildProductFormData(body,files){ //FormData allows us to send, text fields + arrays + actual image files in one HTTP request.

    const formData = new FormData();

    formData.append('title', body.title); // basic product info
    formData.append("description", body.description);
    formData.append("category", body.category);
    formData.append("brand", body.brand);
    formData.append("price", String(body.price));
    formData.append("salePercentage", String(body.salePercentage));
    formData.append("stock", String(body.stock));
    formData.append("status", body.status);

    body.colors.forEach((color) => formData.append("colors", color)); //colors is an array
    body.sizes.forEach((size) => formData.append('sizes', size))
    files.forEach((file) => formData.append("images", file)); //`files` contains actual File objects selected from <input type="file">.

    if('existingImages' in body && body.existingImages){
        formData.append('existingImages', JSON.stringify(body.existingImages)) // JSON.stringify() converts the array into a string
    }//'existingImages' tells the backend which old images should remain

    if("coverImagePublicId" in body && body.coverImagePublicId){
        formData.append('coverImagePublicId', body.coverImagePublicId)
    }//`coverImagePublicId` identifies the cover image stored in Cloudinary

    return formData;
}
export async function createAdminProduct(body, files) {

    const formData = buildProductFormData(body, files);
    return apiPost("/admin/products/", formData);
} //Create a completely new product

export async function updateAdminProduct(productId, body,files) {

    const formData = buildProductFormData(body, files);

    return apiPut(`/admin/products/${productId}`, formData)  
}//Update an existing product and `productId` tells the backend which product to modify