import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCustomerCategories, getCustomerProductFacets, getCustomerProducts } from "./api";

export function useCustomerProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [loadedQuery, setLoadedQuery] = useState(null);

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") || "",
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
      search: filters.search || undefined,
      category: filters.category || undefined,
      brand: filters.brand || undefined,
      color: filters.color || undefined,
      size: filters.size || undefined,
      sort,
    }),
    [filters, sort],
  );

  const hasActiveFilters = Boolean(
    filters.search || filters.category || filters.brand || filters.color || filters.size,
  );

  const updateParams = useCallback((nextParams) => {
    setSearchParams(nextParams);
  }, [setSearchParams]);

  const setSearch = useCallback(
    (term) => {
      const nextParams = new URLSearchParams(searchParams);
      if (term && term.trim()) {
        nextParams.set("search", term.trim());
      } else {
        nextParams.delete("search");
      }
      updateParams(nextParams);
    },
    [searchParams, updateParams],
  );

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
    [searchParams, updateParams],
  );

  const clearFilters = () => {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete("search");
    nextParams.delete("category");
    nextParams.delete("brand");
    nextParams.delete("size");
    nextParams.delete("color");

    updateParams(nextParams);
  };

  // active filter badges
  const activeFilterBadges = useMemo(() => {
    const items = [];

    if (filters.search) {
      items.push({
        key: "search",
        label: "Search",
        value: `"${filters.search}"`,
      });
    }

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
    let active = true;

    getCustomerCategories()
      .then((data) => {
        if (active) setCategories(data ?? []);
      })
      .catch((error) => {
        console.error("Failed to load categories:", error);
        if (active) setCategories([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    getCustomerProducts(query)
      .then((data) => {
        if (active) {
          setProducts(data ?? []);
          setLoadedQuery(query);
        }
      })
      .catch((error) => {
        console.error("Failed to load products:", error);
        if (active) {
          setProducts([]);
          setLoadedQuery(query);
        }
      });

    return () => {
      active = false;
    };
  }, [query]);

  // Load available facets from dedicated lightweight backend endpoint
  useEffect(() => {
    let active = true;

    getCustomerProductFacets()
      .then((data) => {
        if (active && data) {
          setAvailableColors(data.colors ?? []);
          setAvailableBrands(data.brands ?? []);
        }
      })
      .catch((error) => {
        console.error("Failed to load facets:", error);
        if (active) {
          setAvailableColors([]);
          setAvailableBrands([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return {
    categories,
    products,
    loading: loadedQuery !== query,
    filters,
    sort,
    hasActiveFilters,
    changeSort,
    availableColors,
    availableBrands,
    toggleFacet,
    clearFilters,
    setSearch,
    activeFilterBadges,
  };
}