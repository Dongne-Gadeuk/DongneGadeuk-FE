// src/types/store.ts

import type { ItemCategory } from "./item";

// 지도 가게 카드
export interface RecentStore {
  storeId: number;
  storeName: string;
  address: string;
  category: ItemCategory;
  storeUrl: string;
  visitCount: number;
}

// 최근 방문 가게 응답
export interface RecentStoreResponse {
  totalCount: number;
  stores: RecentStore[];
}

// 지도 화면 카드용 타입
export interface StoreMapCard {
  storeId: number;
  storeName: string;
  address: string;
  category: ItemCategory;
  imageUrl: string;
  visitCount: number;
}

// 가게별 아이템 카드
export interface StoreItem {
  itemId: number;
  userItemId: number | null;
  itemName: string;
  imageUrl: string | null;
  requiredVisitCount: number;
  owned: boolean;
}

// 가게별 아이템 리스트 응답
export interface StoreItemListResponse {
  storeId: number;
  storeName: string;
  visitCount: number;
  items: StoreItem[];
}