import { parseReceipt, type ReceiptData } from "@/utils/parseReceipt";

export async function extractReceipt(imageDataUrl: string): Promise<ReceiptData> {
    // data URL prefix 제거 -> 순수 base64
    const base64 = imageDataUrl.replace(/^data:image\/\w+;base64,/, "");

    const res = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
    });

    if (!res.ok) throw new Error("OCR 요청 실패");

    const { text } = (await res.json()) as { text: string };
    return parseReceipt(text);
}