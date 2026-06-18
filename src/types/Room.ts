// ERD 매핑 타입

// 방 논리 좌표 캔버스. x,y(INT)는 이 좌표계 기준이며 화면 크기와 무관하게 저장된다.
export const ROOM = { w: 360, h: 360 } as const;
// scale=1.0 일 때 아이템 기준 폭(논리 단위)
export const BASE_ITEM_W = 90;
export interface OwnedItem {
  userItemId: number;
  itemId: number;
  itemName: string;
  imageUrl: string;
  place: boolean;
  storeName: string;   // 💡 "기본 상점" 대신 string 타입 명시
  visitCount: number;  // 💡 0 대신 number 타입 명시
}

/** Placements row → 방에 배치된 아이템 (+ 표시용 imageUrl) */
export interface Placement {
  uid: string;
  placementId?: number;
  userItemId: number;
  imageUrl: string;
  x: number;
  y: number;
  order: number;
  scale: number;
  topBottom: boolean;
  leftRight: boolean;
}

/** 서버로 보낼 한 행 */
export interface PlacementInput {
  placementId?: number; // updated 항목: 서버 row id
  tempId?: string; // added 항목: 클라 임시키 (응답 id 매핑용)
  userItemId: number;
  x: number;
  y: number;
  order: number;
  scale: number;
  topBottom: boolean;
  leftRight: boolean;
}

/** 저장 페이로드 — diff 3분류 (한 번에 전송) */
export interface SavePayload {
  added: PlacementInput[]; // 새로 배치됨 → INSERT
  updated: PlacementInput[]; // 위치/크기/순서/반전 변경됨 → UPDATE
  removedIds: number[]; // 사라진 placementId → DELETE
}

/** 저장 응답 — 신규 INSERT된 행의 임시키↔서버 id 매핑 */
export interface SaveResult {
  idMap?: Record<string, number>; // tempId -> 서버 발급 placementId
}

