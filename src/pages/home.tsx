import { useEffect, useState } from "react";
import { Header } from "@/components/common/Header";
import { BottomBar } from "@/components/common/BottomBar";
import { RoomScene } from "@/components/room/RoomScene";
import { ItemSheet } from "@/components/room/ItemSheet";
import { EditToolbar } from "@/components/room/Edittoolbar";
import { useRoomEditor } from "@/hooks/useRoomEditor";
import { fetchOwnedItems, fetchRoom, syncRoom } from "@/api/room";
import type { OwnedItem, Placement } from "@/types/Room";

export const HomePage = () => {
  const [owned, setOwned] = useState<OwnedItem[] | null>(null);
  const [placed, setPlaced] = useState<Placement[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 💡 환경변수가 제대로 들어왔는지 콘솔에 찍어보기
    console.log("현재 주입된 API 주소:", import.meta.env.VITE_API_BASE_URL);

    let alive = true;
    (async () => {
      try {
        const [o, p] = await Promise.all([fetchOwnedItems(), fetchRoom()]);
        if (!alive) return;
        setOwned(o);
        setPlaced(p);
      } catch {
        if (alive) setError("방 정보를 불러오지 못했어요.");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (error) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background text-[14px] text-grey">
        {error}
      </div>
    );
  }
  if (!owned || !placed) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background text-[14px] text-grey">
        불러오는 중…
      </div>
    );
  }

  return <RoomView initialOwned={owned} initialPlaced={placed} />;
};

// 데이터가 다 온 뒤에만 마운트 → 훅 초기값이 비어버리는 문제 방지
function RoomView({ initialOwned, initialPlaced }: { initialOwned: OwnedItem[]; initialPlaced: Placement[] }) {
  // 저장: diff(added/updated/removedIds) 를 한 번에 서버로. onSave 가 idMap 반환.
  const room = useRoomEditor({ initialOwned, initialPlaced, onSave: syncRoom });
  const editing = room.mode === "edit";

  return (
    <div className="flex h-dvh flex-col bg-background">
      <Header />

      <main className="relative flex flex-1 flex-col overflow-hidden">
        {room.saveError && (
          <div className="absolute left-1/2 top-3 z-40 -translate-x-1/2 rounded-lg bg-red/90 px-3 py-2 text-[13px] text-white shadow">
            {room.saveError}
          </div>
        )}

        {editing && (
          <div className="absolute right-3 top-3 z-30 flex gap-2">
            <button
              onClick={room.cancelEdit}
              className="h-10 cursor-pointer rounded-xl bg-white px-3.5 font-semibold text-brown shadow"
            >
              취소
            </button>
            <button
              onClick={room.save}
              disabled={room.saving}
              className="h-10 cursor-pointer rounded-xl bg-mint px-4 font-bold text-white shadow disabled:cursor-default disabled:opacity-60"
            >
              저장
            </button>
          </div>
        )}

        <div className="flex flex-1 items-center px-3 pt-3">
          <RoomScene
            drawOrder={room.drawOrder}
            editable={editing}
            selectedUid={room.selectedUid}
            onSelect={room.selectItem}
            onMove={room.moveTo}
            onScale={room.setScale}
          />
        </div>

        {!editing && (
          <div className="px-6 pb-7">
            <button
              onClick={room.enterEdit}
              className="w-full cursor-pointer rounded-[18px] bg-mint py-4 text-[17px] font-bold text-white shadow-md"
            >
              내 방 꾸미기
            </button>
          </div>
        )}

        {editing && (
          <div className="absolute inset-x-0 bottom-0 z-20">
            <EditToolbar
              visible={!!room.selected}
              onFlipLeftRight={room.flipLeftRight}
              onFlipTopBottom={room.flipTopBottom}
              onRemove={room.removeSelected}
            />
            <ItemSheet items={room.available} onPick={room.addItem} onClose={room.cancelEdit} />
          </div>
        )}
      </main>

      <BottomBar />
    </div>
  );
}