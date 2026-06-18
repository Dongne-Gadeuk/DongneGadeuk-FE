import { useEffect, useState } from "react";
import { Header } from "@/components/common/Header";
import { BottomBar } from "@/components/common/BottomBar";
import { fetchCollectionItems } from "@/api/item";
import type { Category, CollectionItem } from "@/types/item";

import lockIcon from "@/assets/common/lock.svg";

const USER_ID = 1;

const tabs: { label: string; value: Category }[] = [
  { label: "전체", value: "ALL" },
  { label: "카페", value: "CAFE" },
  { label: "식당", value: "RESTAURANT" },
  { label: "기타", value: "ETC" },
];

export const CollectionPage = () => {
  const [category, setCategory] = useState<Category>("ALL");
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    const loadItems = async () => {
      setLoading(true);
      setError("");

      try {
        // 카테고리별 아이템 조회
        const data = await fetchCollectionItems(USER_ID, category);

        if (alive) {
          setItems(data);
        }
      } catch (err) {
        console.error(err);
        if (alive) {
          setError("아이템을 불러오지 못했어요.");
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
  }, [category]);

  return (
    <div className="flex h-dvh flex-col bg-main">
      <Header />

      <main className="flex-1 overflow-hidden bg-[#f7f3f0] px-5 pb-24 pt-8">
        {/* 제목 */}
        <section>
          <h1 className="text-[27px] font-extrabold text-[#2f2926]">
            아이템 도감
          </h1>
          <p className="mt-1 text-[14px] font-medium text-[#6f6761]">
            내가 모은 전체 아이템들
          </p>
        </section>

        {/* 가운데 정렬 탭 */}
        <section className="mt-8">
          <div className="flex justify-center border-b border-[#ddd5ce]">
            <div className="flex w-full max-w-[310px] justify-between">
              {tabs.map((tab) => {
                const active = category === tab.value;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setCategory(tab.value)}
                    className={`relative pb-3 text-[13px] font-bold ${
                      active ? "text-[#52643f]" : "text-[#6f6761]"
                    }`}
                  >
                    {tab.label}
                    {active && (
                      <span className="absolute bottom-[-1px] left-0 h-[2px] w-full rounded-full bg-[#52643f]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 아이템 목록 */}
        <section className="mt-5 h-[calc(100%-150px)] overflow-y-auto">
          {loading && (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-[#6f6761]">
              불러오는 중…
            </div>
          )}

          {error && (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-[#6f6761]">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.userItemId}
                  className="aspect-square rounded-[14px] bg-[#efe3db] p-2 shadow-sm"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}

              {/* 마지막 잠금 카드 */}
              <div className="flex aspect-square items-center justify-center rounded-[14px] bg-[#efe3db] p-5 shadow-sm">
                <img
                  src={lockIcon}
                  alt="잠금"
                  className="h-10 w-10 object-contain"
                />
              </div>
            </div>
          )}
        </section>
      </main>

      <BottomBar />
    </div>
  );
};