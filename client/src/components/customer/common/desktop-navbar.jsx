import { useAuth } from "@clerk/react";
import { ShoppingBag, Heart, User, LogOut, ShoppingCart, ShoppingBasket, Search, Truck, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CustomerMobileNavbar } from "./mobile-navbar";
import { useCustomerWishlistStore } from "@/features/customer/wishlist/store";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/store";
import { useCustomerProfileStore } from "@/features/customer/profile/store";
import { useCustomerOrdersStore } from "@/features/customer/orders/store";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-ckeckout/store";

const shell =
  "mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8";

const headerClass =
  "sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl";

const navLinkClass =
  "inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-semibold tracking-wide text-foreground/80 transition-colors hover:bg-muted/50 hover:text-foreground";

const iconButtonClass =
  "relative inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition hover:bg-muted/60 hover:text-foreground";

const badgeClass =
  "absolute -right-1 -top-1 inline-flex min-w-4.5 h-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground";

export function CustomerNavbar() {
  const { isSignedIn, signOut, isLoaded } = useAuth();
  const { isBootstrapped, user } = useAuthStore();
  const isAdmin = Boolean(isSignedIn && user?.role === "admin");

  const {
    items: wishlistItems,
    loadWishlist,
    clear: clearWishlist,
    setOpen: setWishListOpen,
  } = useCustomerWishlistStore((state) => state);

  const { clear: clearProfile, openProfile } = useCustomerProfileStore(
    (state) => state,
  );
  const { clear: clearOrders, openOrders } = useCustomerOrdersStore(
    (state) => state,
  );

  const { setOpen, cart, loadCart } = useCustomerCartAndCheckoutStore(
    (state) => state,
  );
  const [navSearch, setNavSearch] = useState("");
  const navigate = useNavigate();

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/collections?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch("");
    }
  };

  useEffect(() => {
    if (!isLoaded || !isBootstrapped) return;

    void loadCart(Boolean(isSignedIn));

    if (!isSignedIn) {
      clearWishlist();
      clearProfile();
      clearOrders();
      return;
    }
    void loadWishlist();
  }, [
    clearWishlist,
    clearProfile,
    clearOrders,
    isBootstrapped,
    isLoaded,
    isSignedIn,
    loadWishlist,
    loadCart,
  ]);

  const wishlistCount = wishlistItems.length;
  const cartCount = cart?.totalQuantity ?? 0;

  return (
    <header className={headerClass}>
      {/* Top Announcement Bar */}
      <div className="w-full bg-muted/20 py-1.5 text-xs font-medium text-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="hidden sm:block w-16" />
          <div className="flex items-center justify-center gap-2 mx-auto text-xs">
            <Truck className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Free Shipping on all orders over ₹999</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-muted-foreground text-[11px] font-mono">
            <span>INR ₹</span>
          </div>
        </div>
      </div>

      <div className={shell}>
        {/* Left Section: Brand name wear.it + Collections + New Arrivals */}
        <div className="flex items-center gap-6 lg:gap-8">
          {/* Brand */}
          <Link to="/" className="flex shrink-0 items-center gap-2 group">
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-white text-black border border-black/15 dark:bg-black dark:text-white dark:border-white/20 transition-transform group-hover:scale-105 shadow-xs">
              <ShoppingBag className="h-4.5 w-4.5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              wear.it
            </span>
          </Link>

          {/* Left Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/collections" className={navLinkClass}>
              Collections
            </Link>
            <Link to="/collections?sort=recent" className={navLinkClass}>
              New Arrivals
            </Link>
          </nav>
        </div>

        {/* Right Section: Search, Wishlist, Account, Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Bar */}
          <form
            onSubmit={handleNavSearch}
            className="relative hidden sm:flex items-center"
          >
            <Search className="absolute left-3.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, brands..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="h-9 w-40 md:w-52 lg:w-64 rounded-full border border-border/80 bg-background/80 pl-9 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
            />
          </form>

          {/* Admin Dashboard Button (Only visible to verified admins) */}
          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary/10 px-3.5 text-xs font-semibold text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              title="Open Admin Dashboard"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          )}

          {/* Wishlist Icon */}
          <button
            type="button"
            onClick={() => {
              if (!isSignedIn) {
                navigate("/sign-in");
              } else {
                setWishListOpen(true);
              }
            }}
            aria-label={`Wishlist, ${wishlistCount} items`}
            className={iconButtonClass}
          >
            <Heart className="h-4.5 w-4.5" />
            {wishlistCount > 0 && (
              <span className={badgeClass}>{wishlistCount}</span>
            )}
          </button>

          {/* Account */}
          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 gap-1.5 rounded-full px-2.5 text-xs font-medium text-foreground hover:bg-muted/60"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">Account</span>
                  </Button>
                }
              />

              <DropdownMenuContent
                align="end"
                className="w-52 rounded-xl border-border bg-popover/95 p-1.5 shadow-lg backdrop-blur"
              >
                {isAdmin && (
                  <DropdownMenuItem
                    onClick={() => navigate("/admin")}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-primary focus:bg-primary/10 focus:text-primary"
                  >
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => void openProfile()}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium"
                >
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => void openOrders()}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium"
                >
                  <ShoppingBasket className="h-4 w-4" />
                  <span>My Orders</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => void signOut()}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/sign-in"
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-foreground transition hover:bg-muted/60"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {/* Cart Icon */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={iconButtonClass}
            aria-label={`Open cart, ${cartCount} items`}
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            {cartCount > 0 && <span className={badgeClass}>{cartCount}</span>}
          </button>

          {/* Mobile Menu trigger */}
          <CustomerMobileNavbar
            isSignedIn={Boolean(isSignedIn)}
            isAdmin={isAdmin}
            onSignOut={signOut}
            onCartOpen={() => setOpen(true)}
            cartCount={cartCount}
            onProfileOpen={openProfile}
            onOrdersOpen={openOrders}
            onWishlistOpen={() => {
              if (!isSignedIn) {
                navigate("/sign-in");
              } else {
                setWishListOpen(true);
              }
            }}
            wishlistCount={wishlistCount}
          />
        </div>
      </div>
    </header>
  );
}