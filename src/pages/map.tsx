import { Header } from "@/components/common/Header";
import { BottomBar } from "@/components/common/BottomBar";

export const MapPage = () => {
  return (
    <div className="flex h-dvh flex-col bg-main">
      <Header />
      <main className="flex-1 flex items-center justify-center font-bold">
        우리동네 지도 페이지 (준비 중)
      </main>
      <BottomBar />
    </div>
  );
};