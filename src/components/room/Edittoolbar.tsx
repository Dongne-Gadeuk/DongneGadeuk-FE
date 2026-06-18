interface EditToolbarProps {
  visible: boolean;
  onFlipLeftRight: () => void;
  onFlipTopBottom: () => void;
  onRemove: () => void;
}

export function EditToolbar({ visible, onFlipLeftRight, onFlipTopBottom, onRemove }: EditToolbarProps) {
  if (!visible) return null;

  const base = "flex-1 whitespace-nowrap rounded-xl px-3 py-2.5 text-[13px] font-semibold shadow cursor-pointer";

  return (
    <div className="mb-3 flex gap-2 px-4">
      <button className={`${base} bg-white text-brown`} onClick={onFlipLeftRight}>좌우반전</button>
      <button className={`${base} bg-white text-brown`} onClick={onFlipTopBottom}>상하반전</button>
      <button className={`${base} bg-red/10 text-red`} onClick={onRemove}>삭제</button>
    </div>
  );
}