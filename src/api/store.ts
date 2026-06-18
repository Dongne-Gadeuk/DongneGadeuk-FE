import type {
  RecentStoreResponse,
  StoreItemListResponse,
  StoreMapCard,
} from "@/types/store";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

const unwrap = <T,>(json: T | ApiResponse<T>): T => {
  if (
    typeof json === "object" &&
    json !== null &&
    "data" in json &&
    "success" in json
  ) {
    return (json as ApiResponse<T>).data;
  }

  return json as T;
};

// 최근 방문 가게 조회
export const fetchRecentStores = async (
  userId: number
): Promise<RecentStoreResponse> => {
  const res = await fetch(`${BASE_URL}/api/stores/recent?userId=${userId}`);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message ?? "최근 방문 가게 조회 실패");
  }

  return unwrap<RecentStoreResponse>(json);
};

// 지도 카드용 데이터 변환
export const fetchStoreMapCards = async (
  userId: number
): Promise<StoreMapCard[]> => {
  const data = await fetchRecentStores(userId);

  return data.stores.map((store) => ({
    storeId: store.storeId,
    storeName: store.storeName,
    address: store.address,
    category: store.category,
    imageUrl: store.storeUrl,
    visitCount: store.visitCount,
  }));
};

// 가게별 아이템 조회
export const fetchStoreItems = async (
  userId: number,
  storeId: number
): Promise<StoreItemListResponse> => {
  const res = await fetch(
    `${BASE_URL}/api/stores/${storeId}/items?userId=${userId}`
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message ?? "가게별 아이템 조회 실패");
  }

  return unwrap<StoreItemListResponse>(json);
};