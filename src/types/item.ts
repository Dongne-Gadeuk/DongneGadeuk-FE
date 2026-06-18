// src/types/item.ts

export type Category = "ALL" | "CAFE" | "RESTAURANT" | "ETC";
export type ItemCategory = Exclude<Category, "ALL">;
//
// 아이템 도감 카드
export interface CollectionItem {
  userItemId: number;
  itemId: number;
  itemName: string;
  category: ItemCategory;
  imageUrl: string;
  requiredAt: string;
  placed: boolean;
}

// 아이템 도감 응답
export interface CollectionResponse {
  category: Category;
  items: CollectionItem[];
}

// 방 꾸미기용 소유 아이템
export interface OwnedItem {
  userItemId: number;
  itemId: number;
  itemName: string;
  imageUrl: string;
  placed: boolean;
  storeName: string;
  visitCount: number;
}
