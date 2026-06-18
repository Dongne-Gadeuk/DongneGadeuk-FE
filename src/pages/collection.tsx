import { Header } from "@/components/common/Header";
import { BottomBar } from "@/components/common/BottomBar";

export const CollectionPage = () => {
  return (
    <div className="flex h-dvh flex-col bg-main">
      <Header />
      <main className="flex-1 flex items-center justify-center font-bold">
        내 컬렉션 페이지 (준비 중)
      </main>
      <BottomBar />
    </div>
  );
};