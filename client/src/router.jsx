import { createBrowserRouter } from "react-router-dom";

import { CustomerLayout } from "./components/layout/CustomerLayout";
import { PublicOnlyLayout } from "./components/auth/PublicOnlyLayout"
import { ProtectedLayout } from "./components/auth/ProtectedLayout";

import { CustomerProfile } from "./pages/customer/Profile";
import { SignInPage } from "./pages/auth/Sign-in";
import { SignUpPage } from "./pages/auth/Sign-up";
import { StoreHome } from "./pages/customer/Home";
import { RoleGaurdLayout } from "./components/auth/RoleGuardLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminCoupons from "./pages/admin/Promos";
import AdminOrders from "./pages/admin/Order";
import AdminSettings from "./pages/admin/Settings";
import { AdminLayout } from "./components/layout/AdminLayout";
import Collections from "./pages/customer/collections";
import { CustomerWishlist } from "./pages/customer/Wishlist";
import CollectionDetails from "./pages/customer/Collection-Details";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <CustomerLayout/>,
        children: [
            {
                index : true,
                element : <StoreHome/>,
            },
            {
                element: <PublicOnlyLayout />,
                children: [
                    {
                        path: "sign-in/*",
                        element: <SignInPage/>,
                    },
                    {
                        path: "sign-up/*",
                        element: <SignUpPage />,
                    },
                ],
            },
            {
                path: "collections",
                element: <Collections />,
            },
            {
                path: "collection/:id",
                element: <CollectionDetails />,
            },
            {
                element : <ProtectedLayout/>,
                children : [
                    {
                        path: 'profile',
                        element : <CustomerProfile/>
                    },
                    {
                        path: 'wishlist',
                        element: <CustomerWishlist />,
                    }
                ]
            }

        ]
    },
    {
        element : <ProtectedLayout/>,
        children : [
            {
            element : <RoleGaurdLayout allow={["admin"]} />,
            children : [{
                path : "/admin",
                element : <AdminLayout/>,

                children : [
                    {
                        index : true,
                        element : <AdminDashboard/>
                    },
                    {
                        path : 'products',
                        element : <AdminProducts />
                    },
                    {
                        path : 'coupons',
                        element : <AdminCoupons />
                    },
                    {
                        path : 'orders',
                        element : <AdminOrders />
                    },
                    {
                        path : 'settings',
                        element : <AdminSettings />
                    }
                    
                ]
            }]

        }]
    }
])