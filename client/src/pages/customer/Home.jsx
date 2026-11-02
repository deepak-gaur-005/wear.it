import { CommonLoader } from "@/components/common/loader";
import CustomerProductCard from "@/components/customer/products/customer-product-card";
import { HomeBannerCarousel } from "@/components/customer/home/home-banner-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCustomerHomeStore } from "@/features/customer/home/store";
import { ArrowRight, Check, Copy, Grid2X2, Sparkles, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function StoreHome() {
  const { data, loading, loadHome } = useCustomerHomeStore((state) => state);
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(""), 2500);
  };

  if (loading) {
    return <CommonLoader />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased pb-16">
      {/* Auto-Scrollable Banner Carousel every 3 seconds (strictly matching reference layout) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <HomeBannerCarousel banners={data.banners || []} />
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="space-y-14 sm:space-y-20">
          {/* Handpicked / Recent Products Section (matches reference screenshot "HANDPICKED FOR YOU") */}
          {!!data.recentProducts.length && (
            <section>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-center sm:text-left">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                    Handpicked Selection
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground uppercase">
                    Handpicked For You
                  </h2>
                </div>

                <Link to="/collections?sort=recent">
                  <Button
                    variant="ghost"
                    className="text-xs uppercase tracking-wider font-semibold gap-1.5"
                  >
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {data.recentProducts.slice(0, 4).map((product) => (
                  <CustomerProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Categories Grid */}
          {!!data.categories.length && (
            <section>
              <div className="mb-6 space-y-1 text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  Collections
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Browse by Wardrobe Category
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {data.categories.slice(0, 4).map((categoryItem) => (
                  <Link
                    to={`/collections?category=${categoryItem._id}`}
                    key={categoryItem._id}
                    className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary/5 text-primary mb-4 transition-transform duration-300 group-hover:scale-110">
                      <Grid2X2 className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-medium tracking-tight text-foreground mb-1">
                      {categoryItem.name}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary mt-2">
                      View Collection
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Exclusive Offers & Coupon Cards */}
          {!!data.coupons.length && (
            <section className="rounded-2xl border border-border/50 bg-muted/20 p-6 sm:p-8">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Seasonal Perks
                  </div>
                  <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
                    Available Promo Codes
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Apply during checkout to redeem instant discounts
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {data.coupons.slice(0, 4).map((coupon) => (
                  <div
                    key={coupon._id ?? coupon.code}
                    className="relative flex flex-col justify-between rounded-2xl border border-dashed border-primary/30 bg-card p-4 transition-all duration-300 hover:border-primary/60"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                        {coupon.percentage}% OFF
                      </Badge>
                      <Tag className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="space-y-1 mb-4">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Code
                      </p>
                      <p className="font-mono text-base font-bold tracking-widest text-foreground">
                        {coupon.code}
                      </p>
                      {coupon.minimumOrderValue > 0 && (
                        <p className="text-[11px] text-muted-foreground">
                          Orders above ₹{coupon.minimumOrderValue}
                        </p>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyCoupon(coupon.code)}
                      className="w-full rounded-lg h-8 text-xs font-medium gap-1.5"
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
