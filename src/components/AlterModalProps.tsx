import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// ?url 방식 + CSS mask 로 색상 제어 (BottomBar와 동일한 패턴)
import locationIcon from "@/assets/common/location.svg?url";
import recentIcon from "@/assets/common/recent.svg?url";
import calendarIcon from "@/assets/common/calendar_clock.svg?url";

/** SVG를 mask로 찍어 bg 색으로 칠하는 아이콘 */
function MaskIcon({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`block h-7 w-7 ${className}`}
      style={{
        maskImage: `url("${src}")`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskImage: `url("${src}")`,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

/** 미리 정의된 3가지 케이스 */
type AlertVariant = "location" | "daily" | "date";

const VARIANT_PRESET: Record<
  AlertVariant,
  { src: string; title: string; description: string }
> = {
  location: {
    src: locationIcon,
    title: "위치를 확인해 주세요",
    description: "성북구 안에 있는 가게의\n영수증만 사용 가능합니다.",
  },
  daily: {
    src: recentIcon,
    title: "하루에 한 번만 가능합니다",
    description:
      "동일한 가게는 하루에 한 번만 등록하실 수 있습니다.\n내일 다시 시도해 주세요.",
  },
  date: {
    src: calendarIcon,
    title: "날짜를 확인해 주세요",
    description: "현재 날짜로부터 일주일 이내의\n영수증만 사용 가능합니다.",
  },
};

interface AlertModalProps {
  /** 모달 노출 여부 */
  open: boolean;
  /** 미리 정의된 케이스 선택 (icon/title/description 자동 세팅) */
  variant?: AlertVariant;

  /** 아래 3개는 variant 없이 직접 쓰거나, variant 값을 덮어쓸 때 사용 */
  icon?: ReactNode;
  title?: string;
  description?: ReactNode;

  /** 아이콘 색상 클래스 (mask + bg). 기본값: 코랄 */
  iconColorClassName?: string;

  /** 메인 버튼 텍스트 */
  primaryLabel?: string;
  /** 서브 버튼 텍스트 */
  secondaryLabel?: string;
  /** 메인 버튼 클릭. 지정 안 하면 /receipt 로 이동 */
  onPrimary?: () => void;
  /** 서브 버튼 클릭. 지정 안 하면 onClose 호출 */
  onSecondary?: () => void;
  /** 닫기 (배경 클릭 / 나중에 하기) */
  onClose?: () => void;
}

export function AlertModal({
  open,
  variant,
  icon,
  title,
  description,
  iconColorClassName = "bg-[#C8645A]",
  primaryLabel = "다시 촬영하기",
  secondaryLabel = "나중에 하기",
  onPrimary,
  onSecondary,
  onClose,
}: AlertModalProps) {
  const navigate = useNavigate();

  if (!open) return null;

  const preset = variant ? VARIANT_PRESET[variant] : undefined;

  // override(직접 전달) > variant preset 순으로 적용
  const finalTitle = title ?? preset?.title ?? "";
  const finalDescription = description ?? preset?.description ?? "";
  const finalIcon =
    icon ??
    (preset ? (
      <MaskIcon src={preset.src} className={iconColorClassName} />
    ) : null);

  const handlePrimary = () => {
    if (onPrimary) onPrimary();
    else navigate("/receipt");
  };

  const handleSecondary = () => {
    if (onSecondary) onSecondary();
    else onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[320px] rounded-[28px] bg-[#F8F0ED] px-6 pb-7 pt-8 text-center shadow-xl"
      >
        {/* 아이콘 */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2D9D3]">
          {finalIcon}
        </div>

        {/* 제목 */}
        <h2 className="mb-2 text-xl font-bold text-light-brown">{finalTitle}</h2>

        {/* 설명 */}
        <p className="mb-6 whitespace-pre-line text-sm leading-relaxed text-grey">
          {finalDescription}
        </p>

        {/* 메인 버튼 */}
        <button
          type="button"
          onClick={handlePrimary}
          className="mb-3 w-full rounded-full bg-point-khaki py-3.5 text-base font-semibold text-white transition-opacity active:opacity-80"
        >
          {primaryLabel}
        </button>

        {/* 서브 버튼 */}
        <button
          type="button"
          onClick={handleSecondary}
          className="w-full py-1 text-sm text-brown"
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}