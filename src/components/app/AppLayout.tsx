import { Outlet, Link, useLocation } from "react-router-dom";
import BottomTabBar from "@/components/app/BottomTabBar";
import AppSidebar from "@/components/app/AppSidebar";
import HalaChatButton from "@/components/app/HalaChatButton";
import { Bell, Flame, Settings } from "lucide-react";

const AppLayout = () => {
  const location = useLocation();

  // Derive page title from path
  const pageTitle = (() => {
    const p = location.pathname;
    if (p.startsWith("/practice/writing")) return "Writing Practice";
    if (p.startsWith("/practice/speaking")) return "Speaking Practice";
    if (p.startsWith("/practice")) return "Practice";
    if (p.startsWith("/mock-tests")) return "Mock Tests";
    if (p.startsWith("/vocabulary")) return "Vocabulary";
    if (p.startsWith("/profile")) return "Profile";
    return "";
  })();

  return (
    <div className="min-h-screen flex w-full overflow-x-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top bar (mobile: logo + icons, desktop: breadcrumb + icons) */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b h-14 flex items-center px-4 md:px-6 gap-3">
          {/* Mobile logo */}
          <Link to="/dashboard" className="md:hidden text-lg font-extrabold tracking-tight">
            <span className="text-primary">IELTS</span>
            <span className="text-accent">hala</span>
          </Link>

          {/* Desktop breadcrumb */}
          {pageTitle && (
            <div className="hidden md:flex items-center gap-1.5 text-sm">
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-semibold text-foreground">{pageTitle}</span>
            </div>
          )}

          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-accent/10 pl-2 pr-2.5 py-1 rounded-full">
              <Flame className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-bold text-accent">12</span>
            </div>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors press focus-ring relative">
              <Bell className="w-[18px] h-[18px] text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
            </button>
            <Link to="/profile" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors press focus-ring">
              <Settings className="w-[18px] h-[18px] text-muted-foreground" />
            </Link>
            <Link to="/profile" className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary ml-1">
              R
            </Link>
          </div>
        </header>

        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>
      <BottomTabBar />
      <HalaChatButton />
    </div>
  );
};

export default AppLayout;
