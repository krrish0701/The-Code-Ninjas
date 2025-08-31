import { getPoints, getReports, getRole } from "@/lib/store";
import { User, Medal, MapPin } from "lucide-react";

function badgeFor(points: number): { label: string; color: string } {
  if (points >= 800) return { label: "Gold", color: "bg-yellow-500/10 text-yellow-900 ring-yellow-500/20" };
  if (points >= 500) return { label: "Silver", color: "bg-gray-400/10 text-gray-900 ring-gray-400/30" };
  return { label: "Bronze", color: "bg-amber-500/10 text-amber-900 ring-amber-500/20" };
}

export default function Profile() {
  const points = getPoints();
  const role = getRole() || "Community";
  const reports = getReports();
  const badge = badgeFor(points);

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <section className="md:col-span-2">
        <div className="rounded-2xl border bg-white/70 p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-600/10 text-emerald-700">
              <User className="h-8 w-8" />
            </div>
            <div>
              <div className="text-lg font-bold">You</div>
              <div className="text-sm text-foreground/70">Role: {role}</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-600/10 p-3">
              <div className="text-sm font-medium">Points</div>
              <div className="text-2xl font-bold">{points}</div>
            </div>
            <div className="rounded-xl bg-teal-600/10 p-3">
              <div className="text-sm font-medium">Badge</div>
              <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1 ring-inset ${badge.color}`}>
                <Medal className="h-3 w-3" /> {badge.label}
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="md:col-span-3">
        <div className="rounded-2xl border bg-white/70 p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="mb-2 text-lg font-semibold">Contribution history</h2>
          {reports.length === 0 ? (
            <p className="text-sm text-foreground/60">No reports yet. Submit an incident to earn points.</p>
          ) : (
            <ul className="divide-y">
              {reports.slice(0, 15).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-4 py-2">
                  <div>
                    <div className="text-sm font-medium">{r.type}</div>
                    <div className="text-xs text-foreground/60">{new Date(r.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-foreground/60">
                    <MapPin className="h-3 w-3" /> {r.lat.toFixed(2)}, {r.lng.toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
