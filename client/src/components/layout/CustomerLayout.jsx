import { Outlet } from "react-router-dom";
import { CustomerNavbar } from "../customer/common/desktop-navbar";
import CustomerCartAndCheckoutDrawer from "../customer/cart-and-checkout/customer-cart-and-checkout-drawer";
import CustomerOrdersDialog from "../customer/orders/customer-orders-dialog";
import CustomerProfileDialog from "../customer/profiles/customer-profile-dialog";
import CustomerWishlistDialog from "../customer/wishlist/customer-wishlist-dialog";

export function CustomerLayout() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <CustomerNavbar />
            <CustomerWishlistDialog />
            <CustomerCartAndCheckoutDrawer />
            <CustomerProfileDialog />
            <CustomerOrdersDialog />
            <main className="mx-auto max-w-7xl px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}
    