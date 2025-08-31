import { Link } from "react-router-dom";
import { MapPin, Trophy, User, FilePlus2 } from "lucide-react";

export default function Home() {
  return (
    <div className="grid gap-8">
      <section className="grid gap-6 md:grid-cols-2 md:items-center">
        <div className="space-y-5">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            Community Mangrove Watch
          </h1>
          <p className="max-w-prose text-lg text-foreground/80">
            A participatory platform for coastal communities, fishers, NGOs, and
            forestry officials to report mangrove incidents and protect our
            shores together.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/report" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90">
              Report Incident
            </Link>
            <Link to="/map" className="rounded-full bg-emerald-600/10 px-5 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 hover:bg-emerald-600/20">
              Map View
            </Link>
            <Link to="/leaderboard" className="rounded-full bg-teal-600/10 px-5 py-3 text-sm font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/20 hover:bg-teal-600/20">
              Leaderboard
            </Link>
            <Link to="/profile" className="rounded-full bg-sky-600/10 px-5 py-3 text-sm font-semibold text-sky-700 ring-1 ring-inset ring-sky-600/20 hover:bg-sky-600/20">
              Profile
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border bg-white/60 p-6 shadow-sm ring-1 ring-black/5">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-emerald-300/60 to-teal-300/60 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-gradient-to-br from-sky-300/60 to-emerald-300/60 blur-2xl" />
          <div className="relative grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-emerald-600/10 p-4">
              <div className="mb-2 text-sm font-medium text-emerald-800">Real-time location</div>
              <p className="text-sm text-foreground/80">Use your phone GPS to quickly report incidents from the field.</p>
            </div>
            <div className="rounded-xl bg-teal-600/10 p-4">
              <div className="mb-2 text-sm font-medium text-teal-800">Community-driven</div>
              <p className="text-sm text-foreground/80">Every report helps NGOs and officials respond faster.</p>
            </div>
            <div className="rounded-xl bg-sky-600/10 p-4">
              <div className="mb-2 text-sm font-medium text-sky-800">Map-first</div>
              <p className="text-sm text-foreground/80">Explore incidents with an interactive coastal map.</p>
            </div>
            <div className="rounded-xl bg-amber-500/10 p-4">
              <div className="mb-2 text-sm font-medium text-amber-900">Gamified</div>
              <p className="text-sm text-foreground/80">Earn points and badges for your contributions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction icon={<FilePlus2 className="h-5 w-5" />} title="Report" desc="Cutting, dumping, reclamation, other" to="/report" />
        <QuickAction icon={<MapPin className="h-5 w-5" />} title="Map" desc="View and filter incidents" to="/map" />
        <QuickAction icon={<Trophy className="h-5 w-5" />} title="Leaderboard" desc="Top contributors and badges" to="/leaderboard" />
        <QuickAction icon={<User className="h-5 w-5" />} title="Profile" desc="Points, badges, history" to="/profile" />
      </section>
    </div>
  );
}

function QuickAction({ icon, title, desc, to }: { icon: React.ReactNode; title: string; desc: string; to: string }) {
  return (
    <Link
      to={to}
      className="group relative block rounded-2xl border bg-white/70 p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-sm text-foreground/80">{desc}</p>
    </Link>
  );
}
