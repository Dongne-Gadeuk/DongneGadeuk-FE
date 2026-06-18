import { useRef } from "react";
import { ROOM, BASE_ITEM_W } from "@/types/Room";
import type { Placement } from "@/types/Room";

interface PlacedSpriteProps {
  p: Placement;
  z: number; // zIndex (order로 계산)
  editable: boolean;
  selected: boolean;
  getRoomRect: () => DOMRect | null;
  onSelect: (uid: string) => void;
  onMove: (uid: string, x: number, y: number) => void;
  onScale: (uid: string, scale: number) => void;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function PlacedSprite({
  p,
  z,
  editable,
  selected,
  getRoomRect,
  onSelect,
  onMove,
  onScale,
}: PlacedSpriteProps) {
  const drag = useRef<{ cx: number; cy: number; x: number; y: number; w: number; h: number } | null>(null);
  const resize = useRef<{ cx: number; startScale: number; w: number } | null>(null);

  
  const onBodyDown = (e: React.PointerEvent) => {
    if (!editable) return;
    e.stopPropagation();
    onSelect(p.uid);
    const rect = getRoomRect();
    if (!rect) return;
    drag.current = { cx: e.clientX, cy: e.clientY, x: p.x, y: p.y, w: rect.width, h: rect.height };
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onBodyMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = (e.clientX - d.cx) * (ROOM.w / d.w);
    const dy = (e.clientY - d.cy) * (ROOM.h / d.h);
    onMove(p.uid, clamp(Math.round(d.x + dx), 0, ROOM.w), clamp(Math.round(d.y + dy), 0, ROOM.h));
  };
  const onBodyUp = (e: React.PointerEvent) => {
    drag.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  // ----- 코너 핸들 드래그(리사이즈) -----
  const onHandleDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    const rect = getRoomRect();
    if (!rect) return;
    resize.current = { cx: e.clientX, startScale: p.scale, w: rect.width };
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onHandleMove = (e: React.PointerEvent) => {
    const r = resize.current;
    if (!r) return;
    const dLogical = (e.clientX - r.cx) * (ROOM.w / r.w);
    const newW = BASE_ITEM_W * r.startScale + dLogical * 2; // 양쪽으로 늘어남
    onScale(p.uid, clamp(newW / BASE_ITEM_W, 0.4, 3));
  };
  const onHandleUp = (e: React.PointerEvent) => {
    resize.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  const widthPct = ((BASE_ITEM_W * p.scale) / ROOM.w) * 100;

  return (
    <div
      onPointerDown={onBodyDown}
      onPointerMove={onBodyMove}
      onPointerUp={onBodyUp}
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-md select-none touch-none ${editable ? "cursor-grab" : "cursor-default"}`}
      style={{
        left: `${(p.x / ROOM.w) * 100}%`,
        top: `${(p.y / ROOM.h) * 100}%`,
        width: `${widthPct}%`,
        zIndex: z,
        outline: selected ? "2px dashed var(--color-brown)" : "none",
        outlineOffset: 4,
      }}
    >
      <img
        src={p.imageUrl}
        alt=""
        draggable={false}
        className="block h-auto w-full pointer-events-none"
        style={{ transform: `scaleX(${p.leftRight ? -1 : 1}) scaleY(${p.topBottom ? -1 : 1})` }}
      />

      {/* 선택 시 우하단 리사이즈 핸들 */}
      {editable && selected && (
        <div
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          aria-label="크기 조절"
          className="absolute -bottom-2.5 -right-2.5 h-5 w-5 rounded-full border-2 border-white bg-brown touch-none cursor-nwse-resize shadow"
        />
      )}
    </div>
  );
}