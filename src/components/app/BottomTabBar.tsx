import { NavLink, useLocation } from "react-router-dom";
import { Home, BookOpen, ClipboardList, Languages, User } from "lucide-react";

const tabs = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/practice", icon: BookOpen, label: "Practice" },
  { to: "/mock-tests", icon: ClipboardList, label: "Mock" },
  { to: "/vocabulary", icon: Languages, label: "Vocab" },
  { to: "/profile", icon: User, label: "Profile" },
];

const BottomTabBar = () => {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-stretch justify-around">
        {tabs.map((tab) => {
          const active =
            tab.to === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(tab.to);
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[56px] text-[11px] font-medium transition-colors press focus-ring rounded-lg mx-0.5 my-0.5 ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
              <span className={active ? "font-semibold" : ""}>{tab.label}</span>
              {active && <span className="w-4 h-0.5 bg-primary rounded-full mt-0.5" />}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;
