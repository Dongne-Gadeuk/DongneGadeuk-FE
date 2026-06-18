import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout"; 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <div className="flex min-h-screen items-center justify-center font-bold">
            홈 화면 (기본 세팅 완료!)
          </div>
        ),
      },
      // {
      //   path: "login",
      //   element: <LoginPage />,
      // }, // 앞으로 추가할 페이지들은 여기에 이런 식으로 한 줄씩 얹으시면 됩니다.
    ],
  },
]);