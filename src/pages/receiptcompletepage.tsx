import { Header } from "@/components/common/Header";
import { BottomBar } from "@/components/common/BottomBar";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "@/api/client";

interface ReceiptDto {
    businessNumber: string;
    storeName: string;
    storeAddress: string;
    transactionDate: string;
    totalAmount: number;
}
interface StoreInfo {
    storeId: number;
    storeName: string;
    transactionDate: string;
    visitCount: number;
}
interface RewardItem {
    itemId: number;
    name: string;
    imageUrl: string;
}
interface ScanResult {
    type: "ITEM_CREATE" | "VISIT_ONLY";
    store: StoreInfo;
    item: RewardItem | null;
}

function formatDate(iso?: string): string {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

export const ReceiptCompletePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const receipt = (location.state as { data?: ReceiptDto } | null)?.data;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ScanResult | null>(null);

    const ran = useRef(false);

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;

        if (!receipt) {
            setError("영수증 정보가 없어요. 다시 촬영해주세요.");
            setLoading(false);
            return;
        }

        (async () => {
            try {
                const res = await apiFetch("/api/receipt/receiveItem", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(receipt),
                });
                const json = await res.json();
                if (!res.ok) {
                    throw new Error(json?.message ?? "처리에 실패했어요.");
                }

                const scanResult = json.data as ScanResult;
                setResult(scanResult);

                if (scanResult.type === "VISIT_ONLY") {
                    navigate("/receipt/done", {
                        replace: true,
                        state: { store: scanResult.store },
                    });
                    return;
                }
            } catch (e) {
                setError(e instanceof Error ? e.message : "처리에 실패했어요.");
            } finally {
                setLoading(false);
            }
        })();
    }, [receipt]);

    const placeInRoom = () => navigate("/", { replace: true });

    if (loading) {
        return (
            <div className="flex h-dvh flex-col bg-main">
                <Header />
                <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-mint/30 border-t-mint" />
                    <p className="text-sm text-grey">아이템을 받는 중...</p>
                </main>
                <BottomBar />
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="flex h-dvh flex-col bg-main">
                <Header />
                <main className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                    <p className="text-sm text-grey">{error ?? "결과를 불러오지 못했어요."}</p>
                    <button
                        onClick={() => navigate("/receipt", { replace: true })}
                        className="h-12 rounded-2xl bg-mint px-6 text-base font-semibold text-white"
                    >
                        영수증 촬영하기
                    </button>
                </main>
                <BottomBar />
            </div>
        );
    }

    const { store, item } = result;
    return (
        <div className="flex h-dvh flex-col bg-main">
            <Header />

            <main className="flex flex-1 flex-col overflow-y-auto">
                <div className="flex flex-1 flex-col items-center px-6 pb-6 pt-5">
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

                        <h1 className="mt-3 text-xl font-bold text-light-brown">{store.storeName}</h1>
                        <p className="mt-1 text-sm text-grey">
                            {formatDate(store.transactionDate)}
                            <span className="mx-1.5 text-grey/50">·</span>
                            {store.visitCount}번째 방문
                        </p>
                    </div>

                    <div className="mt-6 flex aspect-square w-full max-w-[250px] items-center justify-center rounded-[2rem] background p-8 shadow-sm">
                        <img
                            src={item!.imageUrl}
                            alt={item!.name}
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>

                    <h2 className="mt-6 text-2xl font-bold text-light-brown">{item!.name}</h2>
                    <p className="mt-2 text-sm text-brown">나만의 방을 꾸밀 소중한 소품을 획득했습니다.</p>

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