import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCustomerCategories, getCustomerProducts } from "./api";

export function useCustomerProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [loading, setLoading] = useState(false);

  const filters = useMemo(
    () => ({
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      color: searchParams.get("color") || "",
      size: searchParams.get("size") || "",
    }),
    [searchParams],
  );

  const sort = searchParams.get("sort") || "recent";

  const query = useMemo(
    () => ({
      category: filters.category || undefined,
      brand: filters.brand || undefined,
      color: filters.color || undefined,
      sort,
      size: filters.size || undefined,
    }),
    [filters, sort],
  );

  const hasActiveFilters = Boolean(
    filters.category || filters.brand || filters.color || filters.size,
  );

  async function loadCategories() {
    try {
      const data = await getCustomerCategories();
      setCategories(data ?? []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]);
    }
  }

  async function loadProducts(params) {
    setLoading(true);

    try {
      const data = await getCustomerProducts(params);
      setProducts(data ?? []);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  function updateParams(nextParams) {
    setSearchParams(nextParams);
  }

  const toggleFacet = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    const currentValue = searchParams.get(key) || "";

    if (currentValue === value) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    updateParams(nextParams);
  };

  const changeSort = useCallback(
    (value) => {
      const nextParams = new URLSearchParams(searchParams);

      if (value === "recent") {
        nextParams.delete("sort");
      } else {
        nextParams.set("sort", value);
      }

      updateParams(nextParams);
    },
    [searchParams, setSearchParams],
  );

  const clearFilters = () => {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete("category");
    nextParams.delete("brand");
    nextParams.delete("size");
    nextParams.delete("color");

    updateParams(nextParams);
  };

  // available colors
  async function loadAvailableColors() {
    try {
      const data = await getCustomerProducts();
      const uniqueColors = new Set();

      (data ?? []).forEach((item) => {
        (item.colors ?? []).forEach((color) => uniqueColors.add(color));
      });

      setAvailableColors(
        Array.from(uniqueColors).sort((a, b) => a.localeCompare(b)),
      );
    } catch (error) {
      console.error("Failed to load available colors:", error);
      setAvailableColors([]);
    }
  }

  // active filter badges
  const activeFilterBadges = useMemo(() => {
    const items = [];

    if (filters.category) {
      const found = categories.find(
        (item) => item._id === filters.category,
      );

      items.push({
        key: "category",
        label: "Category",
        value: found?.name || filters.category,
      });
    }

    if (filters.brand) {
      items.push({
        key: "brand",
        label: "Brand",
        value: filters.brand,
      });
    }

    if (filters.color) {
      items.push({
        key: "color",
        label: "Color",
        value: filters.color,
      });
    }

    if (filters.size) {
      items.push({
        key: "size",
        label: "Size",
        value: filters.size,
      });
    }

    return items;
  }, [categories, filters]);

  useEffect(() => {
    void loadCategories();
  }, []);

  useEffect(() => {
    void loadProducts(query);
  }, [query]);

  useEffect(() => {
    void loadAvailableColors();
  }, []);

  return {
    categories,
    products,
    loading,
    filters,
    sort,
    hasActiveFilters,
    changeSort,
    availableColors,
    toggleFacet,
    clearFilters,
    activeFilterBadges,
  };
}