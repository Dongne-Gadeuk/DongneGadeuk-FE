import { Header } from "@/components/common/Header";
import { BottomBar } from "@/components/common/BottomBar";
import Webcam from "react-webcam";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/api/client";

// data URL -> Blob 변환
function dataUrlToBlob(dataUrl: string): Blob {
    const [header, base64] = dataUrl.split(",");
    const mime = header.match(/:(.*?);/)![1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
}

export const ReceiptPage = () => {
    const webcamRef = useRef<Webcam>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const capture = async () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc || loading) return;

        try {
            setLoading(true);

            const form = new FormData();
            form.append("image", dataUrlToBlob(imageSrc), "receipt.jpg");

            const res = await apiFetch("/api/receipt", { method: "POST", body: form });
            if (!res.ok) throw new Error("처리 실패");

            const saved = await res.json();
            navigate(`/receipt/${saved.id}`); // 저장된 id로 읽기 전용 조회
        } catch (e) {
            console.error(e);
            alert("처리에 실패했어요. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-dvh flex-col bg-main">
            <Header />

            <main className="flex flex-1 flex-col bg-main">
                <div className="relative flex-1 overflow-hidden">
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "environment" }}
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/30" />

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