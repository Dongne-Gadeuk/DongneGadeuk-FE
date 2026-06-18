import { Header } from "@/components/common/Header";
import { BottomBar } from "@/components/common/BottomBar";

export const HomePage = () => {
  return (
    <div className="flex h-dvh flex-col bg-main">
      <Header />

      <main className="flex-1 flex items-center justify-center font-bold">
        홈 화면 (기본 세팅 완료!)
      </main>

      <BottomBar />
    </div>
  );
};