import { client } from "@/api/client";
import type { OwnedItem, Placement, PlacementInput, SavePayload, SaveResult } from "@/types/Room";

// ===== 서버 DTO 모양 (백엔드 record 와 1:1) =====
interface OwnedItemResponseDTO {
  userItemId: number;
  itemId: number;
  itemName: string;
  imageUrl: string;
  placed: boolean; // ← 프론트는 place
}

interface PlacementResponseDTO {
  placementId: number;
  userItemId: number;
  imageUrl: string;
  x: number;
  y: number;
  zOrder: number; // ← 프론트는 order
  scale: number;  // 서버 BigDecimal → JSON number
  topBottom: boolean;
  leftRight: boolean;
}

interface RoomSyncResponseDTO {
  idMap: Record<string, number>;
}

// GET /api/me/items
export async function fetchOwnedItems(): Promise<OwnedItem[]> {
  const { data } = await client.get<OwnedItemResponseDTO[]>("/api/me/items");
  return data.map((d) => ({
    userItemId: d.userItemId,
    itemId: d.itemId,
    itemName: d.itemName,
    imageUrl: d.imageUrl,
    place: d.placed, // placed → place
    storeName: "기본 상점", 
    visitCount: 0,
  }));
}

// GET /api/me/room
export async function fetchRoom(): Promise<Placement[]> {
  const { data } = await client.get<PlacementResponseDTO[]>("/api/me/room");
  return data.map((d) => ({
    uid: `pl-${d.placementId}`, // 서버엔 uid 없으므로 placementId 로 안정적 생성
    placementId: d.placementId,
    userItemId: d.userItemId,
    imageUrl: d.imageUrl,
    x: d.x,
    y: d.y,
    order: d.zOrder, // zOrder → order
    scale: d.scale,
    topBottom: d.topBottom,
    leftRight: d.leftRight,
  }));
}

// 프론트 PlacementInput(order) → 서버 PlacementInput(zOrder)
function toServerInput(p: PlacementInput) {
  return {
    placementId: p.placementId ?? null,
    tempId: p.tempId ?? null,
    userItemId: p.userItemId,
    x: p.x,
    y: p.y,
    zOrder: p.order, // order → zOrder
    scale: p.scale,
    topBottom: p.topBottom,
    leftRight: p.leftRight,
  };
}

// POST /api/me/room/sync
export async function syncRoom(payload: SavePayload): Promise<SaveResult> {
  const body = {
    added: payload.added.map(toServerInput),
    updated: payload.updated.map(toServerInput),
    removedIds: payload.removedIds,
  };
  const { data } = await client.post<RoomSyncResponseDTO>("/api/me/room/sync", body);
  // idMap 키 = tempId(=uid) 그대로 → 훅의 commit 로직과 바로 맞물림
  return { idMap: data.idMap ?? {} };
}