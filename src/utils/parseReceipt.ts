export interface ReceiptData {
    businessNumber: string | null; // 사업자번호
    storeName: string | null; // 가게 이름
    storeAddress: string | null; // 가게 주소
    transactionDate: string | null; // 거래(결제)일시
    totalAmount: number | null; // 총금액
}

export function parseReceipt(rawText: string): ReceiptData {
    const lines = rawText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

    // 1. 사업자번호 (123-45-67890)
    const bizMatch = rawText.match(/\d{3}-\d{2}-\d{5}/);
    const businessNumber = bizMatch ? bizMatch[0] : null;

    // 4. 거래일시 (2024-01-15 14:30:00 / 2024.01.15 / 2024/01/15 14:30 등)
    const dateMatch = rawText.match(
        /(\d{4})[-./](\d{1,2})[-./](\d{1,2})(?:[\sT]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/
    );
    const transactionDate = dateMatch ? dateMatch[0] : null;

    // 5. 총금액 (합계/결제금액 등 키워드 라인에서 가장 큰 숫자)
    const totalKeywords = [
        "합계", "총액", "총금액", "총 금액", "합계금액",
        "결제금액", "결제 금액", "받을금액", "판매금액",
        "승인금액", "총 구매액",
    ];
    let totalAmount: number | null = null;
    for (const line of lines) {
        if (totalKeywords.some((k) => line.includes(k))) {
            const nums = (line.match(/[\d,]+/g) ?? [])
                .map((n) => parseInt(n.replace(/,/g, ""), 10))
                .filter((n) => !isNaN(n) && n > 0);
            if (nums.length) {
                totalAmount = Math.max(...nums);
                break;
            }
        }
    }

    // 3. 주소 (라벨 우선, 없으면 행정구역 키워드로 추정)
    const addrKeywords = ["주소", "소재지"];
    let storeAddress: string | null = null;
    for (const line of lines) {
        if (addrKeywords.some((k) => line.includes(k))) {
            storeAddress = line.replace(/주소|소재지|[:：]/g, "").trim();
            break;
        }
    }
    if (!storeAddress) {
        const regionRegex =
            /(특별시|광역시|특별자치시|특별자치도)|[가-힣]+시\s|[가-힣]+군\s|[가-힣]+구\s|[가-힣]+(로|길)\s?\d/;
        storeAddress = lines.find((l) => regionRegex.test(l)) ?? null;
    }

    // 2. 가게 이름 (라벨 우선, 없으면 상단 라인 추정)
    const nameKeywords = ["상호명", "상호", "가맹점명", "가맹점"];
    let storeName: string | null = null;
    for (const line of lines) {
        if (nameKeywords.some((k) => line.includes(k))) {
            storeName = line.replace(/상호명|상호|가맹점명|가맹점|[:：]/g, "").trim();
            break;
        }
    }
    if (!storeName) {
        storeName =
            lines.slice(0, 5).find(
                (l) =>
                    l.length >= 2 &&
                    !/\d{3}-\d{2}-\d{5}/.test(l) &&
                    !/^\d/.test(l) &&
                    !addrKeywords.some((k) => l.includes(k))
            ) ?? null;
    }

    return { businessNumber, storeName, storeAddress, transactionDate, totalAmount };
}