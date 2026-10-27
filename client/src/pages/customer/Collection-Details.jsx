import { CommonLoader } from "@/components/common/loader";
import CustomerProductDetailsGallery from "@/components/customer/products/details/customer-product-details-gallery";
import CustomerProductDetailsSummary from "@/components/customer/products/details/customer-product-details-summary";
import CustomerProductReviews from "@/components/customer/products/details/customer-product-reviews";
import CustomerProductRelatedCard from "@/components/customer/products/details/customer-related-product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store";
import { useCustomerProductDetailsStore } from "@/features/customer/products/details/store";
import { useCustomerWishlistStore } from "@/features/customer/wishlist/store";
import { useAuth } from "@clerk/react";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const pageWrapClass = "min-h-screen bg-background";

const heroSectionClass =
  "border-b border-border/60 bg-gradient-to-b from-primary/10 via-background to-background";

const heroContainerClass = "mx-auto max-w-7xl px-4 py-8";

const backButtonClass = "mb-4 rounded-none px-0 hover:bg-transparent";

const backIconClass = "mr-2 h-4 w-4";

const heroContentClass = "space-y-2";

const heroEyebrowClass =
  "text-sm uppercase tracking-[0.2em] text-primary";

const heroTitleClass =
  "max-w-3xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl";

const contentContainerClass = "mx-auto max-w-7xl px-4 py-8 sm:py-10";

const contentGridClass =
  "grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12";

const errorWrapClass =
  "mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center";

const errorCardClass = "w-full border-border/60 bg-card";

const errorCardContentClass = "flex flex-col items-center gap-4 p-8";

const errorTitleClass = "text-xl font-semibold text-foreground";

const errorMessageClass = "text-sm text-muted-foreground";

const errorButtonClass = "rounded-none";

const relatedSectionClass = "mt-14 space-y-5";

const relatedHeadingWrapClass = "space-y-1";

const relatedEyebrowClass =
  "text-sm uppercase tracking-[0.18em] text-primary";

const relatedTitleClass =
  "text-2xl font-semibold tracking-tight text-foreground";

const relatedGridClass = "grid gap-5 sm:grid-cols-2 xl:grid-cols-4";

const relatedEmptyClass =
  "border-border/60 bg-card/70 px-6 py-10 text-center text-sm text-muted-foreground";

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
      <div className={errorWrapClass}>
        <Card className={errorCardClass}>
          <CardContent className={errorCardContentClass}>
            <h1 className={errorTitleClass}>Product unavailable</h1>
            <p className={errorMessageClass}>
              {error || "This product could not be found."}
            </p>
            <Button
              render={<Link to="/collections" />}
              nativeButton={false}
              className={errorButtonClass}
            >
              Back to Collections
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={pageWrapClass}>
      <section className={heroSectionClass}>
        <div className={heroContainerClass}>
          <Button
            render={<Link to="/collections" />}
            nativeButton={false}
            variant="ghost"
            className={backButtonClass}
          >
              <ArrowLeft className={backIconClass} />
              Back to Collections
          </Button>

          <div className={heroContentClass}>
            <p className={heroEyebrowClass}>{product.brand}</p>
            <h1 className={heroTitleClass}>{product.title}</h1>
          </div>
        </div>
      </section>

      <div className={contentContainerClass}>
        <div className={contentGridClass}>
          <CustomerProductDetailsGallery
            product={product}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />

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

        <CustomerProductReviews
          key={product._id}
          productId={product._id}
          isSignedIn={Boolean(isSignedIn)}
        />

        <section className={relatedSectionClass}>
          <div className={relatedHeadingWrapClass}>
            <p className={relatedEyebrowClass}>You may also like</p>
            <h2 className={relatedTitleClass}>Related Products</h2>
          </div>

          {relatedProducts.length > 0 ? (
            <div className={relatedGridClass}>
              {relatedProducts.map((item) => {
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
            <div className={relatedEmptyClass}>
              No related products are available right now.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CollectionDetails;