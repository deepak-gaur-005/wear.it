import { useCallback, useEffect, useState } from "react";
import { getAdminCategories, getAdminProducts } from "./api";


export function useAdminProducts(){
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [productDialogOpen, setProductDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null)

    const loadCategories = useCallback(async () => {
    const data = await getAdminCategories();
    setCategories(data ?? []);
  }, []);

    const loadProducts = useCallback(async (searchValue = "") => {
        setLoading(true);

        try {
        const data = await getAdminProducts(searchValue);
        setProducts(data ?? []);
        } catch {
        console.log("fetching failed");
        } finally {
        setLoading(false);
        }
    }, []);


    function openCreateDialog(){
        setEditingProduct(null)
        setProductDialogOpen(true)
    }

    function closeProductDialog(){
        setProductDialogOpen(null)
        setEditingProduct(null)
    }

    const refreshAll = useCallback(async() => {
        await Promise.all([loadCategories(), loadProducts(search)])
    }, [loadCategories, loadProducts, search])

    // useEffect(() => {
    //     void loadCategories();
    // }, [loadCategories]);
    useEffect(() => {
        let ignore = false;

        const fetchCategories = async () => {
            try {
                const data = await getAdminCategories();
                if (!ignore) setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                if (!ignore) {
                    console.error("Failed to load categories:", error);
                    setCategories([]);
                }
            }
        };

        void fetchCategories();

        return () => {
            ignore = true;
        };
    }, []);


    useEffect(() => {
        const timer = setTimeout(() => {
        void loadProducts(search);
        }, 250); // why wait 250ms?? -debouncing

        return () => clearTimeout(timer);
    }, [search, loadProducts]);

    return {
        search,
        setSearch,
        products,
        categories,
        loading,
        refreshAll,
        categoryDialogOpen,
        setCategoryDialogOpen,
        productDialogOpen,
        setProductDialogOpen,
        editingProduct,
        setEditingProduct,
        openCreateDialog,
        closeProductDialog,
    };
}