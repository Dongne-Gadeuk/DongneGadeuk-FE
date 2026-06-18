import type {
  Category,
  CollectionItem,
  CollectionResponse,
} from "@/types/item";

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

// 아이템 도감 조회
export const fetchCollection = async (
  userId: number,
  category: Category
): Promise<CollectionResponse> => {
  const res = await fetch(
    `${BASE_URL}/api/items/collection?userId=${userId}&category=${category}`
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message ?? "아이템 도감 조회 실패");
  }

  return unwrap<CollectionResponse>(json);
};

// 최신 획득순 아이템 조회
export const fetchCollectionItems = async (
  userId: number,
  category: Category
): Promise<CollectionItem[]> => {
  const data = await fetchCollection(userId, category);

  return [...data.items].sort(
    (a, b) =>
      new Date(b.requiredAt).getTime() - new Date(a.requiredAt).getTime()
  );
};