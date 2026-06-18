import { Header } from "@/components/common/Header";
import { BottomBar } from "@/components/common/BottomBar";
import { useLocation, useNavigate } from "react-router-dom";

interface StoreInfo {
    storeId: number;
    storeName: string;
    transactionDate: string;
    visitCount: number;
}

function formatDate(iso?: string): string {
    if (!iso) {
        const now = new Date();
        return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
    }
    const [y, m, d] = iso.split("-");
    return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

export const ReceiptDonePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const store = (location.state as { store?: StoreInfo } | null)?.store;

    const goDecorate = () => navigate("/", { replace: true });

    return (
        <div className="flex h-dvh flex-col bg-main">
            <Header />

            <main className="flex flex-1 flex-col justify-center px-6">
                <div className="w-full rounded-3xl bg-white px-6 py-9 text-center shadow-sm">
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

                    <h1 className="mt-4 text-3xl font-bold text-light-brown">
                        {store?.storeName ?? "-"}
                    </h1>

                    <p className="mt-4 text-sm text-grey">
                        {formatDate(store?.transactionDate)}
                        <span className="mx-1.5 text-grey/50">·</span>
                        {store?.visitCount ?? 0}번째 방문
                    </p>
                </div>

                <button
                    onClick={goDecorate}
                    className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-mint text-base font-semibold text-white transition-transform active:scale-[0.99]"
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
                    방 꾸미러 가기
                </button>
            </main>

            <BottomBar />
        </div>
    );
};