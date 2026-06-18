import { Header } from "@/components/common/Header";
import { BottomBar } from "@/components/common/BottomBar";
import Webcam from "react-webcam";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { extractReceipt } from "@/api/ocr";

export const ReceiptPage = () => {
    const webcamRef = useRef<Webcam>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const capture = async () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc || loading) return;

        try {
            setLoading(true);
            const data = await extractReceipt(imageSrc);
            console.log("추출 결과:", data);

            // 결과 확인/수정 화면으로 이동 (경로는 프로젝트에 맞게)
            navigate("/receipt/confirm", { state: data });
        } catch (e) {
            console.error(e);
            alert("텍스트 추출에 실패했어요. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-dvh flex-col bg-main">
            <Header />

            <main className="flex flex-1 flex-col bg-main">
                <div className="relative flex-1 overflow-hidden rounded-b-3xl">
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "environment" }}
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/30" />

                    {/* OCR 진행 중 표시 */}
                    {loading && (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 px-4 py-2 backdrop-blur">
                            <p className="text-xs font-semibold text-white">
                                Scanning for text...
                            </p>
                        </div>
                    )}

                    <div className="absolute bottom-28 left-1/2 w-full -translate-x-1/2 px-6 text-center text-white z-10">
                        <p className="text-xs font-semibold">
                            영수증을 사각형 안에 맞춰주세요
                        </p>
                        <p className="mt-1 text-[11px] font-medium opacity-80">
                            Keep your receipt flat for the best results
                        </p>
                    </div>

                    <button
                        onClick={capture}
                        disabled={loading}
                        className="absolute bottom-8 left-1/2 z-10 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full border border-white/60 bg-black/20 backdrop-blur disabled:opacity-50"
                    >
                        <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-[3px] border-white">
                            <div className="h-5 w-5 rounded-full bg-white" />
                        </div>
                    </button>
                </div>
            </main>

            <BottomBar />
        </div>
    );
};