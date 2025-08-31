import { Link } from "react-router-dom";

export function Placeholder({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border bg-white/70 p-6 shadow-sm ring-1 ring-black/5">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-2 text-foreground/80">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 text-sm text-foreground/70">
          This is a placeholder view. Ask to flesh out this page and I will build the full, interactive experience.
        </div>
        <div className="mt-4">
          <Link to="/" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function MapViewPlaceholder() {
  return (
    <Placeholder
      title="Map View"
      description="Interactive map with incident markers and filters (type: Cutting, Dumping, Reclamation, Other)."
    >
      <div className="overflow-hidden rounded-xl border">
        <iframe
          title="map"
          className="h-72 w-full"
          src="https://www.openstreetmap.org/export/embed.html?bbox=106.78%2C-6.22%2C106.90%2C-6.13&layer=mapnik&marker=-6.1754%2C106.8272"
        />
      </div>
    </Placeholder>
  );
}

export function LeaderboardPlaceholder() {
  return (
    <Placeholder
      title="Leaderboard"
      description="Top contributors, points, and gamification badges (Bronze, Silver, Gold)."
    >
      <ul className="mt-3 space-y-2 text-sm">
        <li className="flex items-center justify-between rounded-lg bg-emerald-600/10 px-3 py-2">
          <span>1. Aisha – 980 pts</span>
          <span>Gold</span>
        </li>
        <li className="flex items-center justify-between rounded-lg bg-teal-600/10 px-3 py-2">
          <span>2. Rafi – 720 pts</span>
          <span>Silver</span>
        </li>
        <li className="flex items-center justify-between rounded-lg bg-sky-600/10 px-3 py-2">
          <span>3. Lina – 410 pts</span>
          <span>Bronze</span>
        </li>
      </ul>
    </Placeholder>
  );
}

export function ProfilePlaceholder() {
  return (
    <Placeholder
      title="Profile"
      description="User avatar, role, points, badges, and contribution history."
    >
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-emerald-600/10 p-4">
          <div className="text-sm font-medium">Points</div>
          <div className="text-2xl font-bold">420</div>
        </div>
        <div className="rounded-xl bg-teal-600/10 p-4">
          <div className="text-sm font-medium">Badges</div>
          <div className="text-2xl font-bold">Silver</div>
        </div>
      </div>
    </Placeholder>
  );
}

export function AboutPlaceholder() {
  return (
    <Placeholder
      title="About / Info"
      description="Why mangroves matter, how the community can help, and NGO/Govt contact information."
    >
      <div className="prose prose-sm max-w-none">
        <p>
          Mangroves protect coastlines, store carbon, and support fisheries. Community reporting helps
          detect illegal cutting, dumping, and reclamation quickly.
        </p>
        <ul>
          <li>Report incidents with location and photo</li>
          <li>Join cleanups and awareness drives</li>
          <li>Contact local NGOs and forestry officials</li>
        </ul>
      </div>
    </Placeholder>
  );
}
