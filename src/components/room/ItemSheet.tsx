import { useRef, useState } from "react";
import type { OwnedItem } from "@/types/room";

interface ItemSheetProps {
  items: OwnedItem[];
  onPick: (item: OwnedItem) => void;
  onClose?: () => void;
}

const MIN_H = 130;
const MAX_H = 460;
const DEFAULT_H = 300;
const HOLD_MS = 450; // 이 시간 이상 누르면 "정보"
const MOVE_TOL = 8;  // 이만큼 움직이면 스크롤로 판단 → 탭/홀드 취소
const CARD_W = 200;

type Info = { item: OwnedItem; left: number; top: number; below: boolean };

export function ItemSheet({ items, onPick }: ItemSheetProps) {
  const [height, setHeight] = useState(DEFAULT_H);
  const [info, setInfo] = useState<Info | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; h: number } | null>(null);
  const press = useRef<{ timer: number; moved: boolean; fired: boolean; sx: number; sy: number } | null>(null);

  // ----- 시트 높이 조절 (핸들) -----
  const onDown = (e: React.PointerEvent) => {
    drag.current = { y: e.clientY, h: height };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dy = drag.current.y - e.clientY;
    setHeight(Math.min(MAX_H, Math.max(MIN_H, drag.current.h + dy)));
  };
  const onUp = (e: React.PointerEvent) => {
    drag.current = null;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
  };

  // ----- 정보 카드 위치 계산 (꾹 눌렀을 때) -----
  const openInfo = (item: OwnedItem, btn: HTMLElement) => {
    const grid = gridRef.current;
    if (!grid) return;
    const b = btn.getBoundingClientRect();
    const g = grid.getBoundingClientRect();
    const relLeft = b.left - g.left;
    const relTop = b.top - g.top;
    const pad = 8;
    const left = Math.min(Math.max(pad, relLeft + b.width / 2 - CARD_W / 2), grid.clientWidth - CARD_W - pad);
    const below = relTop < 90; // 맨 윗줄은 아래로, 그 외엔 아이템 위로 떠오름
    const top = below ? relTop + b.height + 8 : relTop - 8;
    setInfo({ item, left, top, below });
    if ("vibrate" in navigator) navigator.vibrate?.(10);
  };

  // ----- 탭 / 길게 누르기 -----
  const startPress = (e: React.PointerEvent, item: OwnedItem) => {
    const btn = e.currentTarget as HTMLElement;
    const p = { timer: 0, moved: false, fired: false, sx: e.clientX, sy: e.clientY };
    p.timer = window.setTimeout(() => {
      if (!press.current || press.current.moved) return;
      press.current.fired = true;
      openInfo(item, btn);
    }, HOLD_MS);
    press.current = p;
  };
  const movePress = (e: React.PointerEvent) => {
    const p = press.current;
    if (!p) return;
    if (Math.abs(e.clientX - p.sx) > MOVE_TOL || Math.abs(e.clientY - p.sy) > MOVE_TOL) {
      p.moved = true;
      clearTimeout(p.timer);
    }
  };
  const endPress = (item: OwnedItem) => {
    const p = press.current;
    press.current = null;
    if (!p) return;
    clearTimeout(p.timer);
    if (!p.fired && !p.moved) onPick(item); // 짧게 탭 → 바로 배치
  };
  const cancelPress = () => {
    if (press.current) clearTimeout(press.current.timer);
    press.current = null;
  };

  return (
    <div
      role="dialog"
      aria-label="아이템 추가"
      className="overflow-y-auto rounded-t-3xl bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.08)]"
      style={{ height }}
    >
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        role="separator"
        aria-orientation="horizontal"
        aria-label="시트 크기 조절"
        className="sticky top-0 z-10 cursor-row-resize touch-none select-none bg-white px-4 pb-2 pt-2.5"
      >
        <div className="mx-auto mb-2 h-[5px] w-10 rounded-full bg-brown/40" />
        <span className="text-xs font-bold tracking-wider text-brown">탭하면 배치 · 길게 누르면 정보</span>
      </div>

      <div className="px-4 pb-5">
        {items.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-grey">
            배치할 수 있는 아이템이 없어요. 영수증을 올려 아이템을 모아보세요.
          </p>
        ) : (
          <div ref={gridRef} className="relative grid grid-cols-3 gap-3">
            {items.map((item) => (
              <button
                key={item.userItemId}
                onPointerDown={(e) => startPress(e, item)}
                onPointerMove={movePress}
                onPointerUp={() => endPress(item)}
                onPointerLeave={cancelPress}
                onPointerCancel={cancelPress}
                onContextMenu={(e) => e.preventDefault()} // 모바일 길게누르기 메뉴 방지
                aria-label={`${item.itemName} — 탭하면 배치, 길게 누르면 정보`}
                className="flex aspect-square cursor-pointer items-center justify-center rounded-2xl bg-background p-2 touch-none select-none"
              >
                <img
                  src={item.imageUrl}
                  alt=""
                  draggable={false}
                  className="h-[70%] w-[70%] pointer-events-none object-contain"
                />
              </button>
            ))}

            {/* 정보 카드 — 아이템 위로 떠오름 */}
            {info && (
              <>
                {/* 빈 곳 탭하면 닫힘 */}
                <div className="absolute inset-0 z-20" onPointerDown={() => setInfo(null)} />
                <div
                  role="dialog"
                  aria-label={`${info.item.itemName} 정보`}
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`absolute z-30 rounded-2xl bg-white p-3.5 shadow-[0_8px_28px_rgba(0,0,0,0.18)] ${
                    info.below ? "" : "-translate-y-full"
                  }`}
                  style={{ left: info.left, top: info.top, width: CARD_W }}
                >
                  <p className="mb-1.5 text-[15px] font-bold text-brown">{info.item.itemName}</p>
                  <div className="flex items-center gap-1.5 text-[13px] leading-tight text-grey">
                    <PinIcon />
                    <span>
                      {info.item.storeName} {info.item.visitCount}회 방문
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}