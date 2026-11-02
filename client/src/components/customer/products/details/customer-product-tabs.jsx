import { getCoverImage } from "@/features/customer/products/product-list-shared";
import { Check, Layers, RotateCcw, ShoppingBag, Sparkles, Truck, Users } from "lucide-react";
import { useState } from "react";

const tabs = [
  { id: "details", label: "Details" },
  { id: "materials", label: "Materials" },
  { id: "fit", label: "Size & Fit" },
  { id: "shipping", label: "Shipping & Returns" },
];

export function CustomerProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState("details");

  // Pick an alternate detail image or the second image for the macro editorial shot
  const macroImage =
    product.images?.[1]?.url ||
    product.images?.[2]?.url ||
    getCoverImage(product);

  return (
    <section className="mt-14 sm:mt-18 pt-10 sm:pt-14">
      {/* 2-Column Grid matching reference screenshot */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-start">
        {/* Left Column: Interactive Tabs & Details */}
        <div className="space-y-6">
          {/* Tabs bar */}
          <div className="flex border-b border-border/80 gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3.5 text-sm font-semibold tracking-tight transition-all relative shrink-0 ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panel */}
          {activeTab === "details" && (
            <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
              <p>
                {product.description ||
                  `Crafted from high-quality heavyweight fabric, this ${product.title.toLowerCase()} delivers unmatched comfort and durability. The relaxed silhouette and minimal design make it a versatile staple for any wardrobe.`}
              </p>

              {/* Bulleted feature icons matching reference */}
              <ul className="space-y-3.5 text-foreground font-medium pt-2">
                <li className="flex items-center gap-3">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>Oversized contemporary fit</span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>Soft &amp; breathable premium textile blend</span>
                </li>
                <li className="flex items-center gap-3">
                  <Layers className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>Precision double-needle structural stitching</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>Reinforced ribbed cuffs and hem</span>
                </li>
                <li className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>Unisex versatile styling</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === "materials" && (
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                100% Sustainably sourced French Terry cotton. Milled with 420 GSM heavyweight yarn for an authentic drape and longevity.
              </p>
              <div className="rounded-lg border border-border/80 bg-muted/20 p-4 space-y-2 text-xs">
                <p className="font-semibold text-foreground uppercase tracking-wider">Garment Care</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Machine wash cold with like colors inside out</li>
                  <li>Do not bleach or tumble dry high</li>
                  <li>Warm iron if needed on reverse</li>
                  <li>Dry flat in shade to preserve silhouette</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "fit" && (
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Engineered for a relaxed, boxy drop-shoulder profile. If you prefer a tailored or closer-to-body look, we recommend sizing down one size.
              </p>
              <ul className="space-y-2 text-xs">
                <li><strong className="text-foreground">Model:</strong> 6'1" (185 cm) wearing size L</li>
                <li><strong className="text-foreground">Fit Profile:</strong> Relaxed / Oversized</li>
                <li><strong className="text-foreground">Length:</strong> Hits just below natural hip</li>
              </ul>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <div className="flex items-start gap-3">
                <Truck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Standard Delivery: 2–4 Business Days</p>
                  <p className="text-xs">Free standard shipping on all qualifying orders over ₹999.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RotateCcw className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">7-Day Effortless Returns</p>
                  <p className="text-xs">Return unused items in their original packaging within 7 days of delivery.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Editorial Fabric Macro Detail Shot */}
        <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/50 bg-neutral-100 dark:bg-neutral-900 shadow-sm">
          {macroImage ? (
            <img
              src={macroImage}
              alt={`${product.title} fabric texture`}
              className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Garment Detail
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
