import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { BottomBar } from "@/components/common/BottomBar";
import { fetchStoreMapCards } from "@/api/store";
import type { StoreMapCard } from "@/types/store";

import mapBg from "@/assets/map/river.svg";
import photoIcon from "@/assets/map/photo.svg";

const USER_ID = 1;

const categoryLabel: Record<string, string> = {
  CAFE: "카페",
  RESTAURANT: "식당",
  ETC: "기타",
};

export const MapPage = () => {
  const navigate = useNavigate();

  const [stores, setStores] = useState<StoreMapCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    const loadStores = async () => {
      try {
        const data = await fetchStoreMapCards(USER_ID);

        if (alive) {
          setStores(data);
        }
      } catch (err) {
        console.error(err);

        if (alive) {
          setError("가게 정보를 불러오지 못했어요.");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    loadStores();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="flex h-dvh flex-col bg-main">
      <Header />

      <main className="relative flex-1 overflow-hidden bg-[#eef2e4]">
        {/* 피그마 지도 배경 */}
        <img
          src={mapBg}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />

        <section className="relative z-10 h-full px-7 pb-24 pt-7">
          {loading && (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-[#697161]">
              불러오는 중…
            </div>
          )}

          {error && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm font-semibold text-[#697161]">
              <p>{error}</p>
              <p className="text-xs font-medium text-[#8a8f82]">
                백엔드 주소, CORS, 테스트 데이터를 확인해 주세요.
              </p>
            </div>
          )}

          {!loading && !error && stores.length === 0 && (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-[#697161]">
              아직 표시할 가게가 없어요.
            </div>
          )}

          {!loading && !error && stores.length > 0 && (
            <div className="h-[470px] overflow-y-auto pr-2">
              <div className="flex flex-col gap-9">
                {stores.map((store, index) => (
                  <button
                    key={store.storeId}
                    type="button"
                    onClick={() => navigate(`/stores/${store.storeId}/items`)}
                    className={`relative w-[132px] rounded-[28px] bg-white p-2 shadow-sm ${
                      index % 2 === 0 ? "ml-0" : "ml-auto mr-4"
                    }`}
                  >
                    <span className="absolute -right-3 -top-3 rounded-full bg-[#78846e] px-2.5 py-1 text-[10px] font-bold text-white">
                      {categoryLabel[store.category] ?? store.category}
                    </span>

                    <img
                      src={store.imageUrl}
                      alt={store.storeName}
                      className="h-[92px] w-full rounded-[23px] object-cover"
                    />

                    <div className="px-1 py-2 text-center">
                      <p className="line-clamp-1 text-[13px] font-extrabold text-[#463833]">
                        {store.storeName}
                      </p>
                      <p className="mt-1 text-[12px] font-semibold text-[#6b625c]">
                        방문 횟수 : {store.visitCount}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 영수증 인증 버튼 */}
          <button
            type="button"
            onClick={() => navigate("/receipt")}
            className="absolute bottom-[18px] left-1/2 flex h-[104px] w-[104px] -translate-x-1/2 items-center justify-center border-0 bg-transparent p-0"
            aria-label="영수증 인증하기"
          >
            <img
              src={photoIcon}
              alt=""
              className="h-full w-full object-contain"
            />
          </button>
        </section>
      </main>

      <BottomBar />
    </div>
  );
};