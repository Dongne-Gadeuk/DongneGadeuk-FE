import { useRef } from "react";
import { ROOM } from "@/types/Room";
import type { Placement } from "@/types/Room";
import { PlacedSprite } from "@/components/room/PlacedSprite";
import roomBg from "@/assets/home/roomscene.png";

interface RoomSceneProps {
  drawOrder: Placement[]; // order 오름차순
  editable: boolean;
  selectedUid?: string | null;
  backgroundUrl?: string;
  onSelect?: (uid: string | null) => void;
  onMove?: (uid: string, x: number, y: number) => void;
  onScale?: (uid: string, scale: number) => void;
}


export function RoomScene({
  drawOrder,
  editable,
  selectedUid,
  backgroundUrl = roomBg,
  onSelect,
  onMove,
  onScale,
}: RoomSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const getRoomRect = () => ref.current?.getBoundingClientRect() ?? null;

  return (
    <div
      ref={ref}
      onPointerDown={() => editable && onSelect?.(null)} 
      className="relative mx-auto w-full max-w-[440px] overflow-hidden rounded-xl bg-cover bg-center touch-none"
      style={{
        aspectRatio: `${ROOM.w} / ${ROOM.h}`,
        backgroundImage: `url(${backgroundUrl})`,
      }}
    >
      {drawOrder.map((p, i) => (
        <PlacedSprite
          key={p.uid}
          p={p}
          z={i + 1}
          editable={editable}
          selected={editable && p.uid === selectedUid}
          getRoomRect={getRoomRect}
          onSelect={(uid) => onSelect?.(uid)}
          onMove={(uid, x, y) => onMove?.(uid, x, y)}
          onScale={(uid, s) => onScale?.(uid, s)}
        />
      ))}
    </div>
  );
}