import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { getCoverImage } from "@/features/customer/products/product-list-shared";
import { ZoomIn } from "lucide-react";
import { useState } from "react";

const galleryWrapClass = "space-y-4 lg:sticky lg:top-6";

const mainImageCardClass = "overflow-hidden border-border/60 bg-card";

const mainImageWrapClass = "relative aspect-[4/5] bg-muted";

const mainImageButtonClass =
  "group relative block h-full w-full cursor-zoom-in overflow-hidden";

const imageClass =
  "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]";

const noImageClass =
  "flex h-full items-center justify-center text-sm text-muted-foreground";

const zoomHintClass =
  "absolute bottom-3 right-3 inline-flex items-center gap-2 bg-background/90 px-3 py-2 text-xs font-medium text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100";

const thumbnailsGridClass = "grid grid-cols-4 gap-3 sm:grid-cols-5";

const thumbnailButtonBaseClass =
  "overflow-hidden border bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const thumbnailButtonActiveClass = "border-primary ring-2 ring-primary/30";

const thumbnailButtonInactiveClass = "border-border/60";

const thumbnailImageWrapClass = "aspect-square bg-muted";

function CustomerProductDetailsGallery({
  product,
  selectedImage,
  setSelectedImage,
}) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const galleryImages = product.images || [];
  const displayImage = selectedImage || getCoverImage(product);

  return (
    <div className={galleryWrapClass}>
      <Card className={mainImageCardClass}>
        <div className={mainImageWrapClass}>
          {displayImage ? (
            <button
              type="button"
              aria-label={`Zoom in on ${product.title}`}
              className={mainImageButtonClass}
              onClick={() => setIsZoomOpen(true)}
            >
              <img
                src={displayImage}
                alt={product.title}
                className={imageClass}
              />
              <span className={zoomHintClass}>
                <ZoomIn className="h-4 w-4" />
                Click to zoom
              </span>
            </button>
          ) : (
            <div className={noImageClass}>No Image</div>
          )}
        </div>
      </Card>

      {galleryImages.length ? (
        <div className={thumbnailsGridClass}>
          {galleryImages.map((item, index) => {
            const isActive = displayImage === item.url;

            return (
              <button
                key={item.publicId || item.url}
                type="button"
                aria-label={`View image ${index + 1} of ${product.title}`}
                aria-pressed={isActive}
                className={`${thumbnailButtonBaseClass} ${
                  isActive
                    ? thumbnailButtonActiveClass
                    : thumbnailButtonInactiveClass
                }`}
                onClick={() => setSelectedImage(item.url)}
              >
                <div className={thumbnailImageWrapClass}>
                  <img
                    src={item.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              </button>
            );
          })}
        </div>
      ) : null}

      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-h-[95vh] max-w-5xl border-0 bg-background/95 p-3 sm:max-w-5xl">
          <DialogTitle className="sr-only">{product.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Enlarged product image
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