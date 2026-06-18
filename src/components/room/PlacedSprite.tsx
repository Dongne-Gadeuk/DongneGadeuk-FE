import { useRef } from "react";
import { ROOM, BASE_ITEM_W } from "@/types/Room";
import type { Placement } from "@/types/Room";

interface PlacedSpriteProps {
  p: Placement;
  z: number;
  editable: boolean;
  selected: boolean;
  getRoomRect: () => DOMRect | null;
  onSelect: (uid: string) => void;
  onMove: (uid: string, x: number, y: number) => void;
  onScale: (uid: string, scale: number) => void;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function PlacedSprite({
  p, z, editable, selected, getRoomRect, onSelect, onMove, onScale,
}: PlacedSpriteProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ cx: number; cy: number; x: number; y: number; w: number; h: number; nx: number; ny: number } | null>(null);
  const resize = useRef<{ cx: number; w: number; startScale: number; scale: number } | null>(null);

  // ----- 본체 드래그 (이동): state 안 건드리고 DOM 직접 -----
  const onBodyDown = (e: React.PointerEvent) => {
    if (!editable) return;
    e.stopPropagation();
    onSelect(p.uid); // 선택은 한 번뿐이라 OK
    const rect = getRoomRect();
    if (!rect) return;
    drag.current = { cx: e.clientX, cy: e.clientY, x: p.x, y: p.y, w: rect.width, h: rect.height, nx: p.x, ny: p.y };
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onBodyMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = (e.clientX - d.cx) * (ROOM.w / d.w);
    const dy = (e.clientY - d.cy) * (ROOM.h / d.h);
    d.nx = clamp(Math.round(d.x + dx), 0, ROOM.w);
    d.ny = clamp(Math.round(d.y + dy), 0, ROOM.h);
    const el = rootRef.current;       // 👈 setState 대신 DOM 직접
    if (el) {
      el.style.left = `${(d.nx / ROOM.w) * 100}%`;
      el.style.top = `${(d.ny / ROOM.h) * 100}%`;
    }
  };
  const onBodyUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    if (d) onMove(p.uid, d.nx, d.ny);  // 👈 끝날 때 딱 한 번 commit
  };

  // ----- 코너 핸들 (리사이즈): 동일하게 -----
  const onHandleDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    const rect = getRoomRect();
    if (!rect) return;
    resize.current = { cx: e.clientX, w: rect.width, startScale: p.scale, scale: p.scale };
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onHandleMove = (e: React.PointerEvent) => {
    const r = resize.current;
    if (!r) return;
    const dLogical = (e.clientX - r.cx) * (ROOM.w / r.w);
    const newW = BASE_ITEM_W * r.startScale + dLogical * 2;
    r.scale = clamp(newW / BASE_ITEM_W, 0.4, 3);
    const el = rootRef.current;       // 👈 DOM 직접
    if (el) el.style.width = `${((BASE_ITEM_W * r.scale) / ROOM.w) * 100}%`;
  };
  const onHandleUp = (e: React.PointerEvent) => {
    const r = resize.current;
    resize.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    if (r) onScale(p.uid, r.scale);    // 👈 끝날 때 한 번만
  };

  const widthPct = ((BASE_ITEM_W * p.scale) / ROOM.w) * 100;

  return (
    <div
      ref={rootRef}
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