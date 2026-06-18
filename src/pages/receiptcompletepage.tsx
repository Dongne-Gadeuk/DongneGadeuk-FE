// pages/receiptcompletepage/index.tsx (파일명/경로는 프로젝트 컨벤션에 맞게)
import { Header } from "@/components/common/Header";
import { BottomBar } from "@/components/common/BottomBar";
import { useNavigate } from "react-router-dom";



// TODO: 백엔드 연동 시 실제 데이터로 교체
const MOCK = {
    storeName: "성신 카페",
    visitCount: 3,
    itemName: "빈티지 에스프레소 머신",
    // 실제로는 백엔드가 내려주는 이미지 URL
  itemImage: "https://placehold.co/300x300?text=Item",
};

function formatToday(): string {
    const now = new Date();
    return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
}

export const ReceiptCompletePage = () => {
    const navigate = useNavigate();

    const placeInRoom = () => {
    console.log("clicked"); // ← 콘솔에 찍히는지 확인
    navigate("/", { replace: true });
};

    return (
        <div className="flex h-dvh flex-col bg-main">
            <Header />

            <main className="flex flex-1 flex-col overflow-y-auto">
                <div className="flex flex-1 flex-col items-center px-6 pb-6 pt-5">
                    {/* 스캔 성공 안내 카드 */}
                    <div className="w-full rounded-3xl bg-white px-5 py-5 text-center shadow-sm">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/15 px-3 py-1 text-xs font-semibold text-point-khaki">
                            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 10-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Receipt Scanned Successfully
                        </span>

                        <h1 className="mt-3 text-xl font-bold text-light-brown">{MOCK.storeName}</h1>
                        <p className="mt-1 text-sm text-grey">
                            {formatToday()}
                            <span className="mx-1.5 text-grey/50">·</span>
                            {MOCK.visitCount}번째 방문
                        </p>
                    </div>

                    {/* 획득 아이템 이미지 */}
                    <div className="mt-6 flex aspect-square w-full max-w-[250px] items-center justify-center rounded-[2rem] background p-8 shadow-sm">
                        <img
                            src={MOCK.itemImage}
                            alt={MOCK.itemName}
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>

                    {/* 아이템 정보 */}
                    <h2 className="mt-6 text-2xl font-bold text-light-brown">{MOCK.itemName}</h2>
                    <p className="mt-2 text-sm text-brown">나만의 방을 꾸밀 소중한 소품을 획득했습니다.</p>

                    {/* 방에 배치하기 버튼 */}
                    <button
                        onClick={placeInRoom}
                        className="mt-auto flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-mint text-base font-semibold text-white transition-transform active:scale-[0.99]"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                            <path
                                d="M12 21s-6-5.3-6-10a6 6 0 1112 0c0 4.7-6 10-6 10z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinejoin="round"
                            />
                            <circle cx="12" cy="11" r="2" fill="currentColor" />
                        </svg>
                        방에 배치하기
                    </button>
                </div>
            </main>

            <BottomBar />
        </div>
    );
};