import { createBrowserRouter } from "react-router-dom";

import { CustomerLayout } from "./components/layout/CustomerLayout";
import { PublicOnlyLayout } from "./components/auth/PublicOnlyLayout"
import { ProtectedLayout } from "./components/auth/ProtectedLayout";

import { CustomerProfile } from "./pages/customer/Profile";
import { SignInPage } from "./pages/auth/Sign-in";
import { SignUpPage } from "./pages/auth/Sign-up";
import { StoreHome } from "./pages/customer/Home";

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
                element : <ProtectedLayout/>,
                children : [
                    {
                        path: 'profile',
                        element : <CustomerProfile/>
                    }
                ]
            }

        ]
    }
])