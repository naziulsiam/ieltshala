import { NavLink, useLocation, Link } from "react-router-dom";
import { Home, BookOpen, ClipboardList, Languages, User, BarChart3, GraduationCap } from "lucide-react";

const links = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/practice", icon: BookOpen, label: "Practice" },
  { to: "/mock-tests", icon: ClipboardList, label: "Mock Tests" },
  { to: "/vocabulary", icon: Languages, label: "Vocabulary" },
  { to: "/profile", icon: User, label: "Profile" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-[240px] border-r bg-card h-screen sticky top-0 shrink-0">
      <Link to="/dashboard" className="flex items-center gap-2.5 px-6 h-16 border-b hover:bg-secondary/50 transition-colors">
        <GraduationCap className="w-6 h-6 text-primary" />
        <span className="text-lg font-extrabold tracking-tight">
          <span className="text-primary">IELTS</span>
          <span className="text-accent">hala</span>
        </span>
      </Link>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {links.map((link) => {
          const active = location.pathname === link.to || (link.to !== "/dashboard" && location.pathname.startsWith(link.to));
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors press focus-ring ${
                active
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <link.icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.5 : 2} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <div className="bg-accent/8 border border-accent/20 rounded-xl p-4">
          <p className="text-sm font-semibold text-foreground">Go Premium</p>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">Unlimited AI feedback & mocks</p>
          <Link
            to="/profile"
            className="block text-center text-xs font-semibold bg-accent text-accent-foreground rounded-lg py-2 press hover:bg-coral-light transition-colors focus-ring"
          >
            Upgrade — ৳499/mo
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
