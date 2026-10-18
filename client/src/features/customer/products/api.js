import { apiGet } from "@/lib/api";


export async function getCustomerCategories(){
    return apiGet('/customer/categories')
}

export async function getCustomerProducts(params) {
    const searchParams = new URLSearchParams();

    if(params?.category){
        searchParams.set('category', params.category)
    }
    if(params?.brand){
        searchParams.set("brand", params.brand);
    }
    if(params?.color){
        searchParams.set("color", params.color);
    }
    if(params?.size){
        searchParams.set("size", params.size);
    }
    if(params?.sort){
        searchParams.set("sort", params.sort);
    }
    const queryString = searchParams.toString();

    const url = queryString ?
        `/customer/products?${queryString}`
        : `/customer/products`;

    return apiGet(url);
}

export async function getCustomerProductDetails(productId) {
  return apiGet(`/customer/products/${productId}`);
}