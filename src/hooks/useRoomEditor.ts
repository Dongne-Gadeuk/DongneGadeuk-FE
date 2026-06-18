import { useCallback, useMemo, useState } from "react";
import type { OwnedItem, Placement, PlacementInput, SavePayload, SaveResult } from "@/types/room";
import { ROOM } from "@/types/room";

export type RoomMode = "view" | "edit";

let uidSeq = 0;
const nextUid = () => `tmp-${Date.now()}-${uidSeq++}`;
const round2 = (n: number) => Math.round(n * 100) / 100;

interface UseRoomEditorArgs {
  initialOwned: OwnedItem[];
  initialPlaced: Placement[];
  onSave?: (payload: SavePayload) => void | SaveResult | Promise<void | SaveResult>;
}

export function useRoomEditor({ initialOwned, initialPlaced, onSave }: UseRoomEditorArgs) {
  const [mode, setMode] = useState<RoomMode>("view");
  const [owned, setOwned] = useState<OwnedItem[]>(initialOwned);
  const [placed, setPlaced] = useState<Placement[]>(initialPlaced);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // 편집 진입 시점 스냅샷 = diff 의 "원본". (취소 시 복구에도 사용)
  const [snap, setSnap] = useState<Placement[]>(initialPlaced);

  // order 오름차순 = 1이 제일 안쪽(먼저 그림)
  const drawOrder = useMemo(() => [...placed].sort((a, b) => a.order - b.order), [placed]);
  // 바텀시트엔 아직 배치 안 한 것만
  const available = useMemo(() => owned.filter((o) => !o.place), [owned]);
  const selected = placed.find((p) => p.uid === selectedUid) ?? null;

  const enterEdit = useCallback(() => {
    setSnap(placed);
    setSelectedUid(null);
    setMode("edit");
  }, [placed]);

  const cancelEdit = useCallback(() => {
    setPlaced(snap); // 스냅샷으로 롤백
    // 보유 목록 place 플래그도 스냅샷 배치 기준으로 복구
    const placedUserItemIds = new Set(snap.map((p) => p.userItemId));
    setOwned((prev) => prev.map((o) => ({ ...o, place: placedUserItemIds.has(o.userItemId) })));
    setSelectedUid(null);
    setMode("view");
  }, [snap]);

  // 아이템 추가: 방 중앙에, order = max + 1, scale 1.0
  const addItem = useCallback((item: OwnedItem) => {
    const uid = nextUid();
    setPlaced((prev) => {
      const order = prev.reduce((m, p) => Math.max(m, p.order), 0) + 1;
      return [
        ...prev,
        {
          uid,
          userItemId: item.userItemId,
          imageUrl: item.imageUrl,
          x: Math.round(ROOM.w / 2),
          y: Math.round(ROOM.h / 2),
          order,
          scale: 1.0,
          topBottom: false,
          leftRight: false,
        },
      ];
    });
    setOwned((prev) => prev.map((o) => (o.userItemId === item.userItemId ? { ...o, place: true } : o)));
    setSelectedUid(uid);
  }, []);

  const patch = useCallback((uid: string, p: Partial<Placement>) => {
    setPlaced((prev) => prev.map((it) => (it.uid === uid ? { ...it, ...p } : it)));
  }, []);

  const moveTo = useCallback((uid: string, x: number, y: number) => patch(uid, { x, y }), [patch]);
  const setScale = useCallback((uid: string, scale: number) => patch(uid, { scale: round2(scale) }), [patch]);

  const flipLeftRight = useCallback(() => {
    if (selectedUid) setPlaced((prev) => prev.map((it) => (it.uid === selectedUid ? { ...it, leftRight: !it.leftRight } : it)));
  }, [selectedUid]);
  const flipTopBottom = useCallback(() => {
    if (selectedUid) setPlaced((prev) => prev.map((it) => (it.uid === selectedUid ? { ...it, topBottom: !it.topBottom } : it)));
  }, [selectedUid]);

  // 맨 앞으로: order = (현재 max) + 1 (gap 허용 — 1씩 정규화는 백엔드 일일 배치)
  const bringToFront = useCallback((uid: string) => {
    setPlaced((prev) => {
      const max = prev.reduce((m, p) => Math.max(m, p.order), 0);
      const t = prev.find((p) => p.uid === uid);
      if (!t || t.order === max) return prev;
      return prev.map((p) => (p.uid === uid ? { ...p, order: max + 1 } : p));
    });
  }, []);

  // 선택 = 자동으로 맨 앞으로. null이면 선택 해제만.
  const selectItem = useCallback(
    (uid: string | null) => {
      setSelectedUid(uid);
      if (uid != null) bringToFront(uid);
    },
    [bringToFront],
  );

  // 삭제: 방 목록에서 제거 + 보유 목록 place=false 복귀 (삭제 판정은 저장 시 diff 가 함)
  const removeSelected = useCallback(() => {
    setPlaced((prev) => {
      const t = prev.find((p) => p.uid === selectedUid);
      if (t) setOwned((o) => o.map((it) => (it.userItemId === t.userItemId ? { ...it, place: false } : it)));
      return prev.filter((p) => p.uid !== selectedUid);
    });
    setSelectedUid(null);
  }, [selectedUid]);

  /**
   * 저장 페이로드 = 스냅샷(원본) 대비 diff. uid 를 매칭 키로 사용.
   *  - added:   placementId 없음 (신규 배치) → tempId(uid) 동봉
   *  - updated: placementId 있고 x/y/order/scale/반전 중 하나라도 변함
   *  - removedIds: 원본엔 있었는데 현재 없음 (placementId 보유 행만)
   *  ※ 안 바뀐 기존 항목은 아무 데도 안 보냄 → 백엔드 오버헤드 제거
   */
  const buildPayload = useCallback((): SavePayload => {
    const origByUid = new Map(snap.map((p) => [p.uid, p]));
    const curUids = new Set(placed.map((p) => p.uid));

    const toInput = (p: Placement, extra: Partial<PlacementInput>): PlacementInput => ({
      userItemId: p.userItemId,
      x: Math.round(p.x),
      y: Math.round(p.y),
      order: p.order,
      scale: round2(p.scale),
      topBottom: p.topBottom,
      leftRight: p.leftRight,
      ...extra,
    });

    const changed = (a: Placement, b: Placement) =>
      a.x !== b.x ||
      a.y !== b.y ||
      a.order !== b.order ||
      a.scale !== b.scale ||
      a.topBottom !== b.topBottom ||
      a.leftRight !== b.leftRight;

    const added: PlacementInput[] = [];
    const updated: PlacementInput[] = [];
    const removedIds: number[] = [];

    for (const cur of placed) {
      if (cur.placementId == null) {
        added.push(toInput(cur, { tempId: cur.uid })); // 신규
        continue;
      }
      const orig = origByUid.get(cur.uid);
      if (!orig || changed(orig, cur)) {
        updated.push(toInput(cur, { placementId: cur.placementId })); // 변경
      }
      // 안 바뀐 기존 항목은 스킵
    }

    for (const orig of snap) {
      if (orig.placementId != null && !curUids.has(orig.uid)) {
        removedIds.push(orig.placementId); // 삭제
      }
    }

    return { added, updated, removedIds };
  }, [placed, snap]);

  const save = useCallback(async () => {
    const payload = buildPayload();
    try {
      setSaving(true);
      const res = (await onSave?.(payload)) ?? undefined;
      const idMap = res?.idMap ?? {};

      // 신규(added) 항목에 서버 발급 placementId 부여 (tempId == uid 매핑)
      const committed = placed.map((p) =>
        p.placementId == null && idMap[p.uid] != null ? { ...p, placementId: idMap[p.uid] } : p,
      );

      setPlaced(committed);
      setSnap(committed); // 다음 diff 의 원본 갱신
      setSelectedUid(null);
      setMode("view");
    } finally {
      setSaving(false);
    }
  }, [buildPayload, onSave, placed]);

  return {
    mode,
    placed,
    drawOrder,
    available,
    selected,
    selectedUid,
    saving,
    enterEdit,
    cancelEdit,
    addItem,
    selectItem,
    moveTo,
    setScale,
    flipLeftRight,
    flipTopBottom,
    bringToFront,
    removeSelected,
    save,
    buildPayload, // 디버그/테스트용
  };
}