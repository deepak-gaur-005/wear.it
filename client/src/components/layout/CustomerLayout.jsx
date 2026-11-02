import { Outlet } from "react-router-dom";
import { CustomerNavbar } from "../customer/common/desktop-navbar";
import { CustomerFooter } from "../customer/common/footer";
import CustomerCartAndCheckoutDrawer from "../customer/cart-and-checkout/customer-cart-and-checkout-drawer";
import CustomerOrdersDialog from "../customer/orders/customer-orders-dialog";
import CustomerProfileDialog from "../customer/profiles/customer-profile-dialog";
import CustomerWishlistDialog from "../customer/wishlist/customer-wishlist-dialog";

export function CustomerLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
            <CustomerNavbar />
            <CustomerWishlistDialog />
            <CustomerCartAndCheckoutDrawer />
            <CustomerProfileDialog />
            <CustomerOrdersDialog />
            <main className="flex-1 w-full">
                <Outlet />
            </main>
            <CustomerFooter />
        </div>
    );
}
    