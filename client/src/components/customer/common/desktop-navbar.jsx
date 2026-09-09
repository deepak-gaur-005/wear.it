import { useAuth } from "@clerk/react";
import { ShoppingBag, Heart, User, LogIn, ShoppingBasket,ShoppingCart, LogOut} from "lucide-react";
import { Link } from "react-router-dom";

// import { useAuthStore } from "@/features/auth/store";
// import { useCustomerWishlistStore } from "@/features/customer/wishlist/store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CustomerMobileNavbar } from "./mobile-navbar";

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
  const { isSignedIn, signOut, } = useAuth();
  // const { isBootstrapped } = useAuthStore();

  // const {
  //     items: wishlistItems,
  //     loadWishlist,
  //     clear: clearWishlist,
  //     setOpen: setWishlistOpen,
  // } = useCustomerWishlistStore((state) => state);

  // const { openProfile, clear: clearProfile } = useCustomerProfileStore(
  //   (state) => state
  // );

  // const { openOrders, clear: clearOrders } = useCustomerOrdersStore((state) => state);
  // const showSignInUi = isLoaded && isBootstrapped && isSignedIn;

  // const wishlistCount = wishlistItems.length;

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
         {/* Wishlist*/}

          {/* {showSignInUi ? (
            <button
              type="button"
              className={iconLink}
              onClick={() => setWishlistOpen(true)}
          >
              <Heart className="h-[20px] w-[20px]" />

              <span className={wishlistBadge}>
                  {wishlistCount}
              </span>
            </button>
          ) : null
          } */}

          {/*Account*/}
          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className={dropdownButton}>
                  <user className="h-4.5 w-4.5" />
                  Account
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
              align="start"
              className={accountDropdownContent}
              >
                {/*My account*/}
                <DropdownMenuItem 
                  asChild
                  className={dropdownItemLink}
                >
                  <User className="h-4 w-4"/>
                  <span> My Account</span>

                </DropdownMenuItem>

                {/*My Orders*/}
                {/* <DropdownMenuItem
                  onclick={() => void openOrders()}
                  className={dropdownItemLink}
                >
                  <ShoppingBasket className="h-4 w-4"/>
                  <span>My Orders</span>
                </DropdownMenuItem> */}

                {/*Logout*/}
                <DropdownMenuItem
                  onClick={() => void signOut()}
                  className={dropdownItemLink}y
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
          {/* <button
            type="button"
            onClick={() => setOpen(true)}
            className={iconLink}
          >
            <ShoppingCart className="h-[18px] w-[18px]" />

            <span className={cartBadge}>
              {cart?.items?.length ?? 0}
            </span>
          </button> */}

        </nav>

        <CustomerMobileNavbar
          isSignedIn={Boolean(isSignedIn)}
        />

      </div>
    </header>
  );
}