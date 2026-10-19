import { useAuth } from "@clerk/react";
import { ShoppingBag, Heart, User, LogIn, LogOut, ShoppingCart, ShoppingBasket } from "lucide-react";
import { Link } from "react-router-dom";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CustomerMobileNavbar } from "./mobile-navbar";
import { useCustomerWishlistStore } from "@/features/customer/wishlist/store";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store";
import { useCustomerProfileStore } from "@/features/customer/profile/store";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-ckeckout/store";

const collectionsPage = {
  label: "Collections",
  href: "/collections",
  icon: ShoppingBag,
};


const shell =
  "mx-auto flex h-[72px] max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8";

const headerClass =
  "sticky top-0 z-50 border-b border-border/70 bg-secondary/60 backdrop-blur-xl";

const textLink =
  "inline-flex h-10 items-center gap-2 rounded-xl px-3 text-[15px] font-medium text-foreground/90 transition hover:bg-white/5 hover:text-foreground";

const iconLink =
  "relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground/90 transition hover:bg-white/5 hover:text-foreground";

const brandWrap =
  "flex shrink-0 items-center gap-3";

const brandTitle =
  "text-[25px] font-semibold tracking-[-0.02em] text-foreground";

const desktopCollectionsWrap =
  "ml-6 hidden lg:block";

const desktopNav =
  "ml-auto hidden items-center gap-1 lg:flex";

const dropdownButton =
  "h-10 rounded-xl px-3 text-[15px] font-medium text-foreground/90 hover:bg-white/5 hover:text-foreground";

const dropdownContent =
  "mt-3 rounded-2xl border-border bg-popover/95 p-2 backdrop-blur";

const accountDropdownContent =
  `${dropdownContent} w-56`;

const dropdownItemLink =
  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5";

const cartBadge =
  "absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-semibold leading-5 text-black";

const wishlistBadge =
  "absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-semibold leading-5 text-black";

function NavTextLink({ href, label, icon: Icon }) {
  return (
    <Link to={href} className={textLink}>
        <Icon className="h-4.5 w-4.5" />
        <span>{label}</span>
    </Link>
  );
}

export function CustomerNavbar () {
  const { isSignedIn, signOut, isLoaded } = useAuth();
  const { isBootstrapped } = useAuthStore();

  const {
    items: wishlistItems,
    loadWishlist,
    clear: clearWishlist,
    setOpen: setWishListOpen,
  } = useCustomerWishlistStore((state) => state);

  const { clear: clearProfile } = useCustomerProfileStore((state) => state);

  const { setOpen, cart, loadCart } = useCustomerCartAndCheckoutStore( (state) => state );

  // const { openOrders } = useCustomerOrdersStore((state) => state);

  useEffect(() => {

    if( !isLoaded || !isBootstrapped) return;

    void loadCart(Boolean(isSignedIn));

    if (!isSignedIn) {
      clearWishlist();
      clearProfile();
      return;
    }
    void loadWishlist();
  }, [clearWishlist, isBootstrapped, isLoaded, isSignedIn, loadWishlist, loadCart, clearProfile])

  const wishlistCount = wishlistItems.length;

  return (
    <header className={headerClass}>

      <div className={shell}>

        {/* Brand */}
        <Link to="/" className={brandWrap}>
          <ShoppingBag className="h-10 w-10" />
          <span className={brandTitle}>wear.it</span>
        </Link>

        {/*collection*/}

        <div className={desktopCollectionsWrap}>
          <NavTextLink
            href={collectionsPage.href}
            label={collectionsPage.label}
            icon={collectionsPage.icon}
          />
        </div>

        {/* Desktop navigation */}
        <nav className={desktopNav}>
          {isSignedIn ? (
            <button
              type="button"
              className={iconLink}
              onClick={() => setWishListOpen(true)}
            >
              <Heart className="h-4.5 w-4.5" />
              <span className={wishlistBadge}>{wishlistCount}</span>
            </button>

          ) : null}

          {/*Account*/}
          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className={dropdownButton} />
                }
              >
                <User className="h-4.5 w-4.5" />
                Account
              </DropdownMenuTrigger>

              <DropdownMenuContent
              align="start"
              className={accountDropdownContent}
              >
                <DropdownMenuItem
                  render={<Link to="/profile" className={dropdownItemLink} />}
                >
                  <User className="h-4 w-4"/>
                  <span>My Account</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  render={<Link to="/account" className={dropdownItemLink} />}
                >
                    <ShoppingBasket className="h-4 w-4"/>
                    <span> My Orders </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => void signOut()}
                  className={dropdownItemLink}
                >
                  <LogOut className="h-4 w-4"/>
                  <span>Logout</span>
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          ) : ( 
            <NavTextLink
              href="/sign-in"
              label="Login"
              icon={LogIn}
            />   
          )}

          {/*Cart*/}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={iconLink}
            aria-label={`Open cart, ${cart?.totalQuantity ?? 0} items`}
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            <span className={cartBadge}>{cart?.totalQuantity ?? 0}</span>
          </button>

        </nav>

        <CustomerMobileNavbar
          isSignedIn={Boolean(isSignedIn)}
          onSignOut={signOut}
          onCartOpen={() => setOpen(true)}
          cartCount={cart?.totalQuantity ?? 0}
        />

      </div>
    </header>
  );
}