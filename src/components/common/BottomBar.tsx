import { NavLink } from "react-router-dom";
import decorate from "@/assets/navigaction/home.svg?url";
import receipt from "@/assets/navigaction/receipt.svg?url";
import map from "@/assets/navigaction/map.svg?url";
import collection from "@/assets/navigaction/collection.svg?url";

const navItems = [
  { to: "/", label: "내 방 꾸미기", icon: decorate },
  { to: "/receipt", label: "영수증 촬영", icon: receipt },
  { to: "/map", label: "우리동네 지도", icon: map },
  { to: "/collection", label: "내 컬렉션", icon: collection },
];

export const BottomBar = () => {
  return (
    <nav className="h-[var(--bottom-bar-height)] shrink-0 border-t border-[#EEEAE6] bg-main flex items-center justify-around rounded-t-2xl px-2">
      {navItems.map(({ to, label, icon }) => {
        return (
          <NavLink
            key={to}
            to={to}
            end
            className="flex-1 h-full flex items-center justify-center"
          >
            {({ isActive }) => (
              <div
                className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-2xl transition-colors ${
                  isActive ? "bg-mint/25" : ""
                }`}
              >
                <span
  aria-hidden
  className={`block h-6 w-6 ${isActive ? "bg-point-khaki" : "bg-brown"}`}
  style={{
    maskImage: `url("${icon}")`,
    maskSize: "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskImage: `url("${icon}")`,
    WebkitMaskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
  }}
/>
                <span
                  className={`text-[11px] whitespace-nowrap ${
                    isActive ? "text-point-khaki font-medium" : "text-brown"
                  }`}
                >
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};