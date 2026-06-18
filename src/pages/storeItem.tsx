import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { BottomBar } from "@/components/common/BottomBar";
import { fetchStoreItems } from "@/api/store";
import type { StoreItem } from "@/types/store";

import lockIcon from "@/assets/common/lock.svg";

const USER_ID = 1;

export const StoreItemPage = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();

  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ownedItems = items.filter((item) => item.owned);
  const hasLockedItem = items.some((item) => !item.owned);

  useEffect(() => {
  const accessToken =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("ACCESS_TOKEN");

  if (!accessToken) {
    navigate("/login", { replace: true });
    return;
  }

  let alive = true;

  const loadItems = async () => {
    if (!storeId) return;

    try {
      const data = await fetchStoreItems(USER_ID, Number(storeId));

      if (alive) {
        setItems(data.items);
      }
    } catch (err) {
      console.error(err);

      if (alive) {
        setError("아이템 정보를 불러오지 못했어요.");
      }
    } finally {
      if (alive) {
        setLoading(false);
      }
    }
  };

  loadItems();

  return () => {
    alive = false;
  };
}, [navigate, storeId]);

  return (
    <div className="flex h-dvh flex-col bg-main">
      <Header />

      <main className="relative flex-1 overflow-hidden bg-[#f7f3f0] px-5 pb-24 pt-8">
        {/* 제목 */}
        <section>
          <h1 className="text-[27px] font-extrabold text-[#2f2926]">
            아이템 리스트
          </h1>
          <p className="mt-1 text-[14px] font-medium text-[#6f6761]">
            이 가게에서 영수증으로 모을 수 있는 아이템들
          </p>
        </section>

        {loading && (
          <div className="flex h-[55vh] items-center justify-center text-sm font-semibold text-[#6f6761]">
            불러오는 중…
          </div>
        )}

        {error && (
          <div className="flex h-[55vh] flex-col items-center justify-center gap-2 text-center text-sm font-semibold text-[#6f6761]">
            <p>{error}</p>
            <p className="text-xs font-medium text-[#8a827b]">
              storeId와 테스트 데이터를 확인해 주세요.
            </p>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="flex h-[55vh] items-center justify-center text-sm font-semibold text-[#6f6761]">
            이 가게의 아이템이 아직 없어요.
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <section className="mt-8 h-[calc(100%-160px)] overflow-y-auto">
            <div className="grid grid-cols-2 gap-5">
              {/* 획득한 아이템 */}
              {ownedItems.map((item) => (
                <div
                  key={item.itemId}
                  className="rounded-[24px] bg-white p-4 shadow-sm"
                >
                  <div className="flex aspect-square items-center justify-center rounded-[20px] bg-[#efe3db] p-3">
                    <img
                      src={item.imageUrl ?? ""}
                      alt={item.itemName}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="mt-3 text-center">
                    <p className="line-clamp-1 text-[14px] font-bold text-[#3f332d]">
                      {item.itemName}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-[#7a716b]">
                      {item.requiredVisitCount}회 방문
                    </p>
                  </div>
                </div>
              ))}

              {/* 미획득 아이템이 있으면 마지막 잠금 카드 */}
              {hasLockedItem && (
                <div className="rounded-[24px] bg-white p-4 shadow-sm">
                  <div className="flex aspect-square items-center justify-center rounded-[20px] bg-white p-5">
                    <img
                      src={lockIcon}
                      alt="잠금"
                      className="h-14 w-14 object-contain"
                    />
                  </div>

                  <div className="mt-3 text-center">
                    <p className="text-[14px] font-bold text-[#3f332d]">
                      아직 해금 X
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-[#7a716b]">
                      더 방문하면 열려요
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 내 컬렉션 이동 */}
        <button
          type="button"
          onClick={() => navigate("/collection")}
          className="absolute bottom-[76px] left-5 right-5 h-14 rounded-[18px] bg-[#7b856e] text-[16px] font-bold text-white shadow-md"
        >
          내 컬렉션
        </button>
      </main>

      <BottomBar />
    </div>
  );
};