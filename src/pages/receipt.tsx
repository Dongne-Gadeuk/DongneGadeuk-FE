import { Header } from "@/components/common/Header";
import { BottomBar } from "@/components/common/BottomBar";

export const ReceiptEndPage = () => {
  return (
    <div className="flex h-dvh flex-col bg-main">
      <Header />
      <main className="flex-1 flex items-center justify-center font-bold">
        영수증r 결과 페이지
      </main>
      <BottomBar />
    </div>
  );
};