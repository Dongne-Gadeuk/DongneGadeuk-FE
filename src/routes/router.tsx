import { createBrowserRouter } from "react-router-dom";
import { BaseLayout } from "../layouts/BaseLayout";
import { AppLayout } from "../layouts/AppLayout";
import { HomePage } from "../pages/home";
import { ReceiptPage } from "../pages/receiptPage";
import { ReceiptResultPage } from "../pages/receiptresultpage";
import { MapPage } from "../pages/map";
import { CollectionPage } from "../pages/collection";
import { SignupPage } from "../pages/signup";
import { LoginPage } from "../pages/login";

import { RequireAuth } from "../routes/RequireAuth";
import { OnboardingPage } from "../pages/onboarding";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        element: <RequireAuth />,        // ← 토큰 검사
        children: [
          {
            element: <AppLayout />,
            children: [
              { index: true, element: <HomePage /> },
              { path: "receipt", element: <ReceiptPage /> },
              { path: "receipt/result", element: <ReceiptResultPage /> },
              { path: "map", element: <MapPage /> },
              { path: "collection", element: <CollectionPage /> },
            ],
          },
        ],
      },
      { path: "onboarding", element: <OnboardingPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
    ],
  },
]);