import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_EDITORIAL_SLIDES = [
  {
    id: "editorial-1",
    imageUrl:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1800&auto=format&fit=crop",
    eyebrow: "Spring / Summer 2026",
    title: "The Art of Refined Everyday Dressing",
    subtitle: "Curated wardrobe essentials crafted with architectural precision and timeless luxury.",
    ctaText: "Explore Collections",
    ctaLink: "/collections",
    badge: "New Season",
    isCustom: false,
  },
  {
    id: "editorial-2",
    imageUrl:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1800&auto=format&fit=crop",
    eyebrow: "Exclusive Drop",
    title: "Timeless Modern Tailoring",
    subtitle: "Heavyweight French Terry, milled cottons, and relaxed contemporary silhouettes.",
    ctaText: "Shop New Arrivals",
    ctaLink: "/collections?sort=recent",
    badge: "Trending Now",
    isCustom: false,
  },
  {
    id: "editorial-3",
    imageUrl:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1800&auto=format&fit=crop",
    eyebrow: "Artisanal Craft",
    title: "Minimalist Essentials & Silhouettes",
    subtitle: "Complimentary delivery on all orders over ₹999 with instant checkout discounts.",
    ctaText: "Discover Now",
    ctaLink: "/collections",
    badge: "Limited Edition",
    isCustom: false,
  },
];

export function HomeBannerCarousel({ banners = [] }) {
  // Use uploaded banners from admin; if none exist, show fallback editorial slides
  const slides =
    banners && banners.length > 0
      ? banners.map((b, i) => ({
          id: b._id || `banner-${i}`,
          imageUrl: b.imageUrl,
          ctaLink: "/collections",
          isCustom: true,
        }))
      : DEFAULT_EDITORIAL_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-scroll every 3.5 seconds when there are multiple slides
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 3500);

    return () => clearInterval(timer);
  }, [nextSlide, isPaused, totalSlides, currentIndex]);

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  if (!totalSlides) return null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl group shadow-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Promotional banner carousel"
    >
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-out h-[340px] sm:h-[420px] md:h-[480px] lg:h-[520px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className="relative w-full h-full shrink-0 overflow-hidden"
          >
            {slide.isCustom ? (
              /* Custom Admin Banner - 100% clear, natural colors, no dark shadows, fully clickable */
              <Link
                to={slide.ctaLink || "/collections"}
                className="block w-full h-full focus:outline-none"
                aria-label="View promotional collection"
              >
                <img
                  src={slide.imageUrl}
                  alt="Promotional banner"
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-101"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </Link>
            ) : (
              /* Default Editorial Fallback Slide */
              <>
                <img
                  src={slide.imageUrl}
                  alt={slide.title || "Collection banner"}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-101"
                  loading={index === 0 ? "eager" : "lazy"}
                />

                {/* Soft gradient restricted to bottom-left text container only (center & top stay clear) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14 lg:p-16 text-white max-w-2xl">
                  {slide.badge && (
                    <div className="mb-3 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white border border-white/30">
                        <Sparkles className="h-3 w-3 text-amber-300" />
                        {slide.badge}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] text-white/90 font-medium">
                        {slide.eyebrow}
                      </span>
                    </div>
                  )}

                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.15] mb-3 drop-shadow-md">
                    {slide.title}
                  </h2>

                  <p className="text-xs sm:text-sm md:text-base text-white/90 line-clamp-2 mb-6 max-w-lg leading-relaxed drop-shadow-sm">
                    {slide.subtitle}
                  </p>

                  <div>
                    <Link to={slide.ctaLink}>
                      <Button
                        size="lg"
                        className="h-10 sm:h-11 rounded-xl bg-white text-black hover:bg-white/90 text-xs sm:text-sm font-semibold uppercase tracking-wider px-6 gap-2 shadow-lg transition-transform active:scale-95"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows - only displayed when multiple slides exist, styled with clean frosted glass */}
      {totalSlides > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/80 hover:bg-white text-neutral-900 dark:bg-black/60 dark:text-white dark:hover:bg-black/80 shadow-md backdrop-blur-md border border-neutral-200/50 dark:border-white/20 transition-all duration-200 opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 z-10"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/80 hover:bg-white text-neutral-900 dark:bg-black/60 dark:text-white dark:hover:bg-black/80 shadow-md backdrop-blur-md border border-neutral-200/50 dark:border-white/20 transition-all duration-200 opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 z-10"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </>
      )}

      {/* Dot Indicators at Bottom - only displayed when multiple slides exist */}
      {totalSlides > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/25 backdrop-blur-sm border border-white/10 shadow-sm">
            {slides.map((_, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`transition-all duration-300 rounded-full ${
                    isActive
                      ? "w-6 h-2 bg-white shadow-xs"
                      : "w-2 h-2 bg-white/60 hover:bg-white"
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
