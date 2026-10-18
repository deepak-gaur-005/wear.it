import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import { useBootstrapAuth } from "./features/auth/useBootstrapAuth";
import { Toaster } from "sonner";

function App(){
  useBootstrapAuth();

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App 