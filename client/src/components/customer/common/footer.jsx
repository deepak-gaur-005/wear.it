import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, ShoppingBag, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export function CustomerFooter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing to wear.it updates");
    setEmail("");
  };

  return (
    <footer className="border-t border-border/80 bg-card text-foreground">
      {/* Brand value pillars */}
      <div className="bg-muted/20 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8 text-center sm:text-left">
            <div className="flex items-center gap-3.5 justify-center sm:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Complimentary Delivery</p>
                <p className="text-xs text-muted-foreground">On all orders over ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center sm:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Artisanal Craftsmanship</p>
                <p className="text-xs text-muted-foreground">Consciously sourced textiles</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center sm:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">7-Day Effortless Returns</p>
                <p className="text-xs text-muted-foreground">Hassle-free reverse pickup</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black border border-black/15 dark:bg-black dark:text-white dark:border-white/20 shadow-xs">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">wear.it</span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              Deliberate aesthetics for modern wardrobes. We design elevated clothing essentials focused on silhouette, tactile comfort, and timeless endurance.
            </p>
            <form onSubmit={handleSubscribe} className="pt-2 max-w-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Join our newsletter
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-xs rounded-xl bg-background"
                />
                <Button type="submit" size="sm" className="rounded-xl px-3.5">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Links Col 1: Shop */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Collections
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/collections" className="hover:text-primary transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link to="/collections?sort=recent" className="hover:text-primary transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/collections?sort=sale" className="hover:text-primary transition-colors">
                  Exclusive Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 2: Customer Care */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Client Care
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <span className="cursor-default">Order Tracking</span>
              </li>
              <li>
                <span className="cursor-default">7-Day Returns</span>
              </li>
              <li>
                <span className="cursor-default">Shipping &amp; Taxes</span>
              </li>
              <li>
                <span className="cursor-default">Care Guide</span>
              </li>
            </ul>
          </div>

          {/* Links Col 3: Legal & Brand */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
              About
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <span className="cursor-default">Our Philosophy</span>
              </li>
              <li>
                <span className="cursor-default">Ethical Production</span>
              </li>
              <li>
                <span className="cursor-default">Privacy Policy</span>
              </li>
              <li>
                <span className="cursor-default">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} wear.it. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted for premium contemporary fashion.
          </p>
        </div>
      </div>
    </footer>
  );
}
