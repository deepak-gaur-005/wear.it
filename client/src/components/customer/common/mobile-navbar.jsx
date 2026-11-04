import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Flame,
  Heart,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const collectionsPages = [
  {
    label: "All Collections",
    href: "/collections",
    icon: ShoppingBag,
  },
  {
    label: "New Arrivals",
    href: "/collections?sort=recent",
    icon: Flame,
  },
];

const iconLink =
  "relative inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition hover:bg-muted/60 hover:text-foreground";

const mobileWrap = "flex items-center gap-1 md:hidden";

const menuButton =
  "h-9 w-9 rounded-full text-foreground hover:bg-muted/60";

const sheetContent =
  "w-[340px] max-w-[88vw] border-r border-border bg-background p-0";

const brandWrap = "flex items-center gap-2.5";

const brandTitle =
  "text-2xl font-bold tracking-tight text-foreground";

const brandBlock = "px-5 py-5 sm:px-6";

const drawerSection = "space-y-2 px-5 py-4 sm:px-6";

const drawerTitle =
  "text-xs font-semibold uppercase tracking-wider text-muted-foreground";

const drawerItemsWrap = "space-y-1";

const drawerItemLink =
  "flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/60";

const cartBadge =
  "absolute -right-1 -top-1 inline-flex min-w-4.5 h-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground";

function DrawerSection({ title, items }) {
  return (
    <section className={drawerSection}>
      <p className={drawerTitle}>{title}</p>

      <div className={drawerItemsWrap}>
        {items.map((item) => {
          const Icon = item.icon;

          return item.onClick ? (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              className={drawerItemLink}
            >
              <Icon className="h-4.5 w-4.5 text-muted-foreground" />
              <span>{item.label}</span>
            </button>
          ) : (
            <Link
              key={item.label}
              to={item.href}
              className={drawerItemLink}
            >
              <Icon className="h-4.5 w-4.5 text-muted-foreground" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function CustomerMobileNavbar({
  isSignedIn,
  isAdmin = false,
  onSignOut,
  onCartOpen,
  cartCount,
  onProfileOpen,
  onOrdersOpen,
  onWishlistOpen,
  wishlistCount,
}) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState("");
  const navigate = useNavigate();

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearch.trim()) {
      navigate(`/collections?search=${encodeURIComponent(mobileSearch.trim())}`);
      setMobileSearch("");
      setMenuOpen(false);
    }
  };

  const mobileAccountItems = isSignedIn
    ? [
        ...(isAdmin
          ? [
              {
                label: "Admin Dashboard",
                icon: ShieldCheck,
                href: "/admin",
              },
            ]
          : []),
        {
          label: "My Profile",
          icon: User,
          onClick: () => {
            onProfileOpen();
            setMenuOpen(false);
          },
        },
        {
          label: "My Orders",
          icon: ShoppingBasket,
          onClick: () => {
            onOrdersOpen();
            setMenuOpen(false);
          },
        },
        {
          label: `Wishlist (${wishlistCount})`,
          icon: Heart,
          onClick: () => {
            setMenuOpen(false);
            if (onWishlistOpen) onWishlistOpen();
          },
        },
        {
          label: "Sign Out",
          icon: LogOut,
          onClick: () => {
            onSignOut();
            setMenuOpen(false);
          },
        },
      ]
    : [
        {
          label: "Sign In",
          href: "/sign-in",
          icon: LogIn,
        },
      ];

  return (
    <div className={mobileWrap}>
      <button
        type="button"
        onClick={onCartOpen}
        className={iconLink}
        aria-label={`Open cart, ${cartCount} items`}
      >
        <ShoppingCart className="h-4.5 w-4.5" />
        {cartCount > 0 && <span className={cartBadge}>{cartCount}</span>}
      </button>

      <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className={menuButton} />
          }
        >
          <Menu className="h-5 w-5" />
        </SheetTrigger>

        <SheetContent side="left" className={sheetContent}>
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>

          <div className={brandBlock}>
            <Link
              to="/"
              className={brandWrap}
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black border border-black/15 dark:bg-black dark:text-white dark:border-white/20 shadow-xs">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className={brandTitle}>wear.it</span>
            </Link>

            <form
              onSubmit={handleMobileSearch}
              className="relative mt-4 flex items-center"
            >
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search collections, products..."
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                className="h-9 w-full rounded-full border border-border bg-muted/40 pl-9 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </form>
          </div>

          <Separator />

          <DrawerSection title="Shop" items={collectionsPages} />

          <Separator />

          <DrawerSection title="Account" items={mobileAccountItems} />
        </SheetContent>
      </Sheet>
    </div>
  );
}