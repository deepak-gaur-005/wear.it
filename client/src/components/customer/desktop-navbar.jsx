// src/components/customer/desktop-navbar.jsx

import { Link } from "react-router-dom";
import { Shirt } from "lucide-react";

const shell =
  "mx-auto flex h-[72px] max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8";

const headerClass =
  "sticky top-0 z-50 border-b border-border/70 bg-secondary/60 backdrop-blur-xl";

const brandWrap = "flex shrink-0 items-center gap-3";

const brandTitle =
  "text-[25px] font-semibold tracking-[-0.02em] text-foreground";

export function CustomerNavbar() {
  return (
    <header className={headerClass}>
      <div className={shell}>
        <Link to="/" className={brandWrap}>
          <Shirt className="h-10 w-10" />
          <span className={brandTitle}>wear.it</span>
        </Link>
      </div>
    </header>
  );
}
