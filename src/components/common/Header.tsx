import mainLogo from "@/assets/logo01.png";

export const Header = () => {
  return (
    <header className="h-[var(--header-height)] shrink-0 px-4 pt-3 flex items-start justify-between bg-main shadow-[0_4px_10px_-6px_rgba(0,0,0,0.15)]">
      <img
        src={mainLogo}
        alt="동네가득 로고"
        className="h-[43px] w-auto mt-2"
      />
      <div className="flex gap-4 mt-7"></div>
    </header>
  );
};