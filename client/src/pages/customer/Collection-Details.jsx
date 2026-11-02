import { CommonLoader } from "@/components/common/loader";
import CustomerProductDetailsGallery from "@/components/customer/products/details/customer-product-details-gallery";
import CustomerProductDetailsSummary from "@/components/customer/products/details/customer-product-details-summary";
import { CustomerProductTabs } from "@/components/customer/products/details/customer-product-tabs";
import CustomerProductReviews from "@/components/customer/products/details/customer-product-reviews";
import CustomerProductRelatedCard from "@/components/customer/products/details/customer-related-product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store";
import { useCustomerProductDetailsStore } from "@/features/customer/products/details/store";
import { useCustomerWishlistStore } from "@/features/customer/wishlist/store";
import { useAuth } from "@clerk/react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function CollectionDetails() {
  const { id = "" } = useParams();
  const { isLoaded, isSignedIn } = useAuth();
  const { isBootstrapped } = useAuthStore();

  const {
    loadProduct,
    clear,
    loading,
    error,
    data,
    selectedImage,
    setSelectedImage,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    toggleWishlist,
    addToCart,
  } = useCustomerProductDetailsStore((state) => state);

  const wishlistItems = useCustomerWishlistStore((state) => state.items);

  const product = data?.product ?? null;

  const relatedProducts = (data?.relatedProducts ?? []).filter(
    (item) => item._id !== product?._id,
  );

  const isWishlistActive = product
    ? wishlistItems.some((item) => item.productId === product._id)
    : false;

  useEffect(() => {
    void loadProduct(id);
    return () => {
      clear();
    };
  }, [clear, id, loadProduct]);

  if (loading) {
    return <CommonLoader />;
  }

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <Card className="w-full border-border/60 bg-card">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <h1 className="text-xl font-semibold text-foreground">Product unavailable</h1>
            <p className="text-sm text-muted-foreground">
              {error || "This product could not be found."}
            </p>
            <Button
              render={<Link to="/collections" />}
              nativeButton={false}
              className="rounded-lg"
            >
              Back to Collections
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Minimal Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 sm:mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/collections" className="hover:text-foreground transition-colors">
            Shop
          </Link>
          {product.category?.name && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link
                to={`/collections?category=${product.category._id}`}
                className="hover:text-foreground transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none">
            {product.title}
          </span>
        </nav>

        {/* Main 2-Column Product Showcase Section strictly matching reference screenshot */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-start">
          {/* Left Column: Vertical Thumbnails + Main Portrait Image */}
          <CustomerProductDetailsGallery
            product={product}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />

          {/* Right Column: Title, Ratings, Price, Color, Size, CTA, Trust Badges */}
          <CustomerProductDetailsSummary
            product={product}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            setSelectedColor={setSelectedColor}
            setSelectedSize={setSelectedSize}
            toggleWishlist={() =>
              toggleWishlist(
                isLoaded,
                isBootstrapped,
                Boolean(isSignedIn),
              )
            }
            isWishlistActive={isWishlistActive}
            onAddToCart={() =>
              addToCart(
                isLoaded,
                isBootstrapped,
                Boolean(isSignedIn),
              )
            }
          />
        </div>

        {/* Product Details Tabs & Macro Texture Crop Section */}
        <CustomerProductTabs product={product} />

        {/* "You May Also Like" Related Products Section strictly matching reference screenshot */}
        <section className="mt-16 sm:mt-20 pt-10 sm:pt-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              You May Also Like
            </h2>
            <Link
              to="/collections"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-foreground hover:text-primary transition-colors"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {relatedProducts.length > 0 ? (
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.slice(0, 4).map((item) => {
                const itemIsWishlisted = wishlistItems.some(
                  (wishlistItem) => wishlistItem.productId === item._id,
                );

                return (
                  <CustomerProductRelatedCard
                    key={item._id}
                    product={item}
                    isWishlistActive={itemIsWishlisted}
                    onToggleWishlist={() =>
                      useCustomerWishlistStore
                        .getState()
                        .toggleItem(
                          item._id,
                          isLoaded,
                          isBootstrapped,
                          Boolean(isSignedIn),
                        )
                    }
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-border/60 bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground">
              Explore more styles in our full collection.
            </div>
          )}
        </section>

        {/* Customer Reviews Section */}
        <div className="mt-14 sm:mt-18 pt-10">
          <CustomerProductReviews
            key={product._id}
            productId={product._id}
            isSignedIn={Boolean(isSignedIn)}
          />
        </div>
      </div>
    </div>
  );
}

export default CollectionDetails;
