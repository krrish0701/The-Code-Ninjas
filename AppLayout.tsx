import { PropsWithChildren } from "react";
import { Link, NavLink, useLocation, Outlet } from "react-router-dom";
import { Leaf, Waves, MapPin, Trophy, User, FilePlus2, Info, ShieldCheck } from "lucide-react";

function NavItem({ to, label, icon: Icon }: { to: string; label: string; icon: React.ElementType }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <NavLink
      to={to}
      className={({ isActive: rrIsActive }) =>
        [
          "flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors",
          (rrIsActive || isActive)
            ? "bg-primary text-primary-foreground"
            : "text-foreground/70 hover:bg-accent hover:text-foreground",
        ].join(" ")
      }
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </NavLink>
  );
}

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-sky-50 text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="group inline-flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
              <Leaf className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="font-extrabold tracking-tight text-primary">Community</p>
              <p className="-mt-1 text-xs font-semibold tracking-wider text-foreground/70">Mangrove Watch</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <NavItem to="/report" label="Report" icon={FilePlus2} />
            <NavItem to="/map" label="Map" icon={MapPin} />
            <NavItem to="/leaderboard" label="Leaderboard" icon={Trophy} />
            <NavItem to="/profile" label="Profile" icon={User} />
            <NavItem to="/admin" label="Admin" icon={ShieldCheck} />
            <NavItem to="/about" label="About" icon={Info} />
          </nav>
        </div>
      </header>

      <main className="container pb-24 pt-6 md:py-10"><Outlet /></main>

      <footer className="border-t bg-background/80">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 text-center text-sm text-foreground/70 md:flex-row md:text-left">
          <div className="flex items-center gap-2">
            <Waves className="h-4 w-4 text-teal-600" />
            <span>Protecting coasts together.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/map" className="hover:text-foreground">Map</Link>
            <Link to="/report" className="hover:text-foreground">Report Incident</Link>
          </div>
        </div>
      </footer>

      {/* Bottom nav for mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-4 py-2 md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-2">
          <NavLink to="/report" className={({ isActive }) => `flex flex-col items-center gap-1 rounded-lg px-2 py-1 text-xs ${isActive ? "text-primary" : "text-foreground/70"}`}>
            <FilePlus2 className="h-5 w-5" />
            Report
          </NavLink>
          <NavLink to="/map" className={({ isActive }) => `flex flex-col items-center gap-1 rounded-lg px-2 py-1 text-xs ${isActive ? "text-primary" : "text-foreground/70"}`}>
            <MapPin className="h-5 w-5" />
            Map
          </NavLink>
          <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 rounded-lg px-2 py-1 text-xs ${isActive ? "text-primary" : "text-foreground/70"}`}>
            <Leaf className="h-5 w-5" />
            Home
          </NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) => `flex flex-col items-center gap-1 rounded-lg px-2 py-1 text-xs ${isActive ? "text-primary" : "text-foreground/70"}`}>
            <Trophy className="h-5 w-5" />
            Rank
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center gap-1 rounded-lg px-2 py-1 text-xs ${isActive ? "text-primary" : "text-foreground/70"}`}>
            <User className="h-5 w-5" />
            You
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
