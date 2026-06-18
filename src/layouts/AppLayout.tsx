import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <>
      {/* 나중에 여기에 공통 Header 같은 걸 넣으시면 됩니다 */}
      <main>
        <Outlet />
      </main>
      {/* 나중에 여기에 공통 BottomBar 같은 걸 넣으시면 됩니다 */}
    </>
  );
};