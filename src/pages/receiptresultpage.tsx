import { Header } from "@/components/common/Header";
import { BottomBar } from "@/components/common/BottomBar";
import { useLocation, useNavigate } from "react-router-dom";

interface ReceiptData {
    businessNumber: string | null;
    storeName: string | null;
    storeAddress: string | null;
    transactionDate: string | null;
    totalAmount: number | null;
}

const FIELDS: { key: keyof ReceiptData; label: string }[] = [
    { key: "storeName", label: "가게명" },
    { key: "businessNumber", label: "사업자번호" },
    { key: "storeAddress", label: "주소" },
    { key: "transactionDate", label: "거래일시" },
    { key: "totalAmount", label: "결제금액" },
];

function formatValue(key: keyof ReceiptData, value: string | number | null): string {
    if (value === null || value === "") return "-";
    if (key === "totalAmount") return `${Number(value).toLocaleString()}원`;
    return String(value);
}

export const ReceiptResultPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { data?: ReceiptData; image?: string } | null;

    const data = state?.data;
    const image = state?.image;

    // 데이터 없이 직접 진입한 경우(새로고침 등) 촬영 화면으로 유도
    if (!data) {
        return (
            <div className="flex h-dvh flex-col bg-main">
                <Header />
                <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                    <p className="text-sm text-gray-600">표시할 영수증 정보가 없어요.</p>
                    <button
                        onClick={() => navigate("/receipt", { replace: true })}
                        className="h-12 rounded-2xl bg-[#7c8b63] px-6 text-base font-medium text-white"
                    >
                        영수증 촬영하기
                    </button>
                </main>
                <BottomBar />
            </div>
        );
    }

    const retake = () => navigate("/receipt", { replace: true });

    const complete = () => {
        // TODO: 완료 시 이동할 곳에 맞게 수정 (예: 홈, 목록 등)
        navigate("/");
    };

    return (
        <div className="flex h-dvh flex-col bg-main">
            <Header />

            <main className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 pb-32 pt-6">
                    <h1 className="text-lg font-bold text-gray-900">영수증 정보 확인</h1>
                    <p className="mt-1 text-xs text-gray-500">
                        내용이 맞는지 확인해주세요. 다르면 다시 찍을 수 있어요.
                    </p>

                    {image && (
                        <img
                            src={image}
                            alt="촬영된 영수증"
                            className="mt-4 max-h-48 w-full rounded-2xl object-contain"
                        />
                    )}

                    <div className="mt-5 flex flex-col gap-3">
                        {FIELDS.map(({ key, label }) => (
                            <div
                                key={key}
                                className="rounded-2xl bg-white px-4 py-3 shadow-sm"
                            >
                                <p className="text-[11px] font-medium text-gray-400">{label}</p>
                                <p className="mt-0.5 break-words text-sm font-semibold text-gray-900">
                                    {formatValue(key, data[key])}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* 하단 고정 버튼 */}
            <div className="absolute bottom-20 left-1/2 z-10 flex w-full -translate-x-1/2 justify-center gap-3 px-6">
                <button
                    onClick={retake}
                    className="h-12 flex-1 rounded-2xl border border-gray-300 bg-white text-base font-medium text-gray-700"
                >
                    다시 찍기
                </button>
                <button
                    onClick={complete}
                    className="h-12 flex-1 rounded-2xl bg-[#7c8b63] text-base font-medium text-white"
                >
                    완료
                </button>
            </div>

            <BottomBar />
        </div>
    );
};