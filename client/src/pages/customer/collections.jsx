import { CommonLoader } from "@/components/common/loader";
import CustomerFiltersPanel from "@/components/customer/products/customer-filters-panel";
import CustomerProductCard from "@/components/customer/products/customer-product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import { useCustomerProductList } from "@/features/customer/products/use-customer-collections";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

const pageWrapClass = "min-h-screen bg-background";

const heroSectionClass = "border-b border-border/60 bg-gradient-to-b from-primary/10 via-background to-background";

const heroContainerClass = "mx-auto max-w-7xl px-4 py-8 sm:py-10";

const heroEyebrowClass = "text-sm uppercase tracking-[0.2em] text-primary";

const heroContentClass = "mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between";

const heroTitleWrapClass = "space-y-2";

const heroTitleClass = "text-3xl font-semibold tracking-tight text-foreground md:text-4xl";

const sortWrapClass = "flex items-center gap-3 text-sm text-muted-foreground";

const sortTriggerClass = "w-[180px] rounded-none bg-card";

const contentContainerClass = "mx-auto max-w-7xl px-4 py-6";

const topBarClass = "mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between";

const activeBadgesWrapClass = "flex flex-wrap items-center gap-2";

const activeBadgeClass = "border-border bg-secondary text-secondary-foreground hover:bg-secondary gap-1";

const topBarActionsClass = "flex items-center gap-3";

const mobileFilterButtonClass = "rounded-none lg:hidden";

const mobileFilterIconClass = "mr-2 h-4 w-4";

const mobileSheetContentClass = "w-full max-w-sm border-border bg-background";

const mobileSheetHeaderClass = "sr-only";

const layoutGridClass = "grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]";

const desktopAsideClass = "hidden lg:block";

const desktopFilterCardClass = "sticky top-24 border-border/60 bg-card/80 p-5";

const productSectionClass = "space-y-6";

const actionButtonClass = "rounded-none";

const emptyCardClass = "border-border/60 bg-card/80";

const emptyCardContentClass = "flex min-h-60 flex-col items-center justify-center gap-4 p-6 text-center";

const emptyTitleClass = "text-xl font-semibold text-foreground";

const productGridClass = "grid gap-5 sm:grid-cols-2 xl:grid-cols-3";

function Collections() {
  const {
    sort,
    changeSort,
    loading,
    products,
    hasActiveFilters,
    categories,
    availableColors,
    filters,
    toggleFacet,
    clearFilters,
    setSearch,
    activeFilterBadges,
  } = useCustomerProductList();

  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [prevSearch, setPrevSearch] = useState(filters.search);

  if (filters.search !== prevSearch) {
    setPrevSearch(filters.search);
    setSearchInput(filters.search || "");
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  if (loading) {
    return <CommonLoader />;
  }

  return (
    <div className={pageWrapClass}>
      <section className={heroSectionClass}>
        <div className={heroContainerClass}>
          <p className={heroEyebrowClass}>Collections</p>

          <div className={heroContentClass}>
            <div className={heroTitleWrapClass}>
              <h1 className={heroTitleClass}>
                {filters.search
                  ? `Search: "${filters.search}"`
                  : "Premium everyday essentials"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {products.length} {products.length === 1 ? "product" : "products"} available
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search input form */}
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search collections..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 pr-8 h-9 w-[220px] sm:w-[260px] rounded-none bg-card text-xs sm:text-sm"
                />
                {searchInput ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      setSearch("");
                    }}
                    className="absolute right-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </form>

              <div className={sortWrapClass}>
                <Select value={sort} onValueChange={changeSort}>
                  <SelectTrigger className={sortTriggerClass}>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="recent">Newest First</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="sale">Biggest Discount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={contentContainerClass}>
        <div className={topBarClass}>
          <div className={activeBadgesWrapClass}>
            {activeFilterBadges.map((item) => (
              <Badge key={item.key} className={activeBadgeClass}>
                {item.label}: {item.value}
                <button
                  type="button"
                  onClick={() => {
                    if (item.key === "search") {
                      setSearch("");
                    } else {
                      toggleFacet(item.key, filters[item.key]);
                    }
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {hasActiveFilters ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            ) : null}
          </div>

          {/* Mobile filter sheet */}
          <div className={topBarActionsClass}>
            <Sheet>
              <SheetTrigger
                render={
                  <Button className={mobileFilterButtonClass} />
                }
              >
                  <SlidersHorizontal className={mobileFilterIconClass} />
                  Filters
              </SheetTrigger>

              <SheetContent
                side="left"
                className={mobileSheetContentClass}
              >
                <SheetHeader className={mobileSheetHeaderClass}>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>

                <CustomerFiltersPanel
                  categories={categories}
                  filters={filters}
                  availableColors={availableColors}
                  hasActiveFilters={hasActiveFilters}
                  onClearFilters={clearFilters}
                  onToggleFacet={toggleFacet}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className={layoutGridClass}>
          <aside className={desktopAsideClass}>
            <Card className={desktopFilterCardClass}>
              <CustomerFiltersPanel
                categories={categories}
                filters={filters}
                availableColors={availableColors}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearFilters}
                onToggleFacet={toggleFacet}
              />
            </Card>
          </aside>

          <section className={productSectionClass}>
            {products.length === 0 ? (
              <Card className={emptyCardClass}>
                <CardContent className={emptyCardContentClass}>
                  <p className={emptyTitleClass}>No Products Found</p>
                  <p className="text-sm text-muted-foreground">
                    Try checking your spelling or clearing some filters to find what you are looking for.
                  </p>

                  {hasActiveFilters && (
                    <Button
                      onClick={clearFilters}
                      className={actionButtonClass}
                    >
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className={productGridClass}>
                {products.map((item) => (
                  <CustomerProductCard
                    key={item._id}
                    product={item}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Collections;
