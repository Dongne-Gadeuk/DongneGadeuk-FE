import { createBrowserRouter } from "react-router-dom";
import { BaseLayout } from "../layouts/BaseLayout";
import { AppLayout } from "../layouts/AppLayout";
import { HomePage } from "../pages/home";
import { ReceiptPage } from "../pages/receipt";
import { MapPage } from "../pages/map";
import { CollectionPage } from "../pages/collection";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "receipt", element: <ReceiptPage /> },
          { path: "map", element: <MapPage /> },
          { path: "collection", element: <CollectionPage /> },
          // {
          //   path: "login",
          //   element: <LoginPage />,
          // },
        ],
      },
    ],
  },
]);