import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCoverImage } from "@/features/customer/products/product-list-shared";
import { ChevronDown, Search } from "lucide-react";
import { useRef, useState } from "react";

function CustomerProductDetailsGallery({
  product,
  selectedImage,
  setSelectedImage,
}) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const thumbnailsRef = useRef(null);
  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : [{ url: getCoverImage(product), isCover: true }];

  const displayImage = selectedImage || getCoverImage(product);

  const scrollThumbnailsDown = () => {
    if (thumbnailsRef.current) {
      thumbnailsRef.current.scrollBy({ top: 120, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 lg:gap-5 sticky top-24">
      {/* Left Vertical Thumbnails Strip */}
      {galleryImages.length > 1 && (
        <div className="order-2 sm:order-1 flex sm:flex-col items-center gap-3 shrink-0">
          <div
            ref={thumbnailsRef}
            className="flex sm:flex-col gap-3 max-h-[500px] overflow-y-auto overflow-x-hidden no-scrollbar py-1 px-1"
          >
            {galleryImages.map((item, index) => {
              const isActive = displayImage === item.url;
              return (
                <button
                  key={item.publicId || item.url || index}
                  type="button"
                  aria-label={`View image ${index + 1} of ${product.title}`}
                  aria-pressed={isActive}
                  onClick={() => setSelectedImage(item.url)}
                  className={`relative h-20 w-16 sm:h-22 sm:w-18 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 transition-all duration-200 shrink-0 ${
                    isActive
                      ? "ring-2 ring-foreground shadow-sm"
                      : "border border-border/80 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={item.url}
                    alt=""
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              );
            })}
          </div>

          {galleryImages.length > 4 && (
            <button
              type="button"
              onClick={scrollThumbnailsDown}
              aria-label="Scroll more thumbnails"
              className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Main Image Showcase */}
      <div className="order-1 sm:order-2 flex-1 relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-border/40">
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.title}
            className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image available
          </div>
        )}

        {/* Floating Zoom / Expand Button */}
        {displayImage && (
          <button
            type="button"
            onClick={() => setIsZoomOpen(true)}
            aria-label={`Enlarge image of ${product.title}`}
            className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-white/95 dark:bg-neutral-800/95 text-foreground shadow-md backdrop-blur flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <Search className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Full-Screen Zoom Modal */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-h-[95vh] max-w-5xl border-0 bg-background/95 p-4 sm:max-w-5xl">
          <DialogTitle className="sr-only">{product.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Enlarged product image preview
          </DialogDescription>
          {displayImage ? (
            <img
              src={displayImage}
              alt={product.title}
              className="max-h-[85vh] w-full object-contain"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CustomerProductDetailsGallery;
