import { getPoints } from "@/lib/store";
import { Medal, Trophy } from "lucide-react";

interface Contributor {
  name: string;
  points: number;
}

const SAMPLE: Contributor[] = [
  { name: "Aisha", points: 980 },
  { name: "Rafi", points: 720 },
  { name: "Lina", points: 410 },
  { name: "Kenji", points: 360 },
  { name: "Maya", points: 330 },
  { name: "Sara", points: 280 },
  { name: "Jon", points: 210 },
  { name: "Fatima", points: 190 },
];

function badgeFor(points: number): { label: string; color: string } {
  if (points >= 800) return { label: "Gold", color: "bg-yellow-500/10 text-yellow-900 ring-yellow-500/20" };
  if (points >= 500) return { label: "Silver", color: "bg-gray-400/10 text-gray-900 ring-gray-400/30" };
  return { label: "Bronze", color: "bg-amber-500/10 text-amber-900 ring-amber-500/20" };
}

const PRIZES = [
  { place: 1, prize: "$500 Coastal Stewardship Grant" },
  { place: 2, prize: "$300 Eco Gear Kit" },
  { place: 3, prize: "$200 Community Cleanup Pack" },
];

export default function Leaderboard() {
  const me = { name: "You", points: getPoints() };
  const ranks = [...SAMPLE, me].sort((a, b) => b.points - a.points).slice(0, 10);

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <section className="md:col-span-3">
        <h1 className="mb-3 text-2xl font-bold tracking-tight">Leaderboard</h1>
        <ul className="divide-y rounded-2xl border bg-white/70 shadow-sm">
          {ranks.map((r, idx) => {
            const b = badgeFor(r.points);
            const place = idx + 1;
            return (
              <li key={r.name} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className={`grid h-8 w-8 place-items-center rounded-full ${place === 1 ? "bg-yellow-500/20" : place === 2 ? "bg-gray-400/20" : place === 3 ? "bg-amber-500/20" : "bg-emerald-600/10"}`}>
                    {place <= 3 ? <Trophy className="h-4 w-4" /> : <span className="text-xs font-semibold">{place}</span>}
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{r.name}</div>
                    <div className="text-xs text-foreground/60">{r.points} pts</div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1 ring-inset ${b.color}`}>
                  <Medal className="h-3 w-3" /> {b.label}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
      <aside className="md:col-span-2">
        <div className="rounded-2xl border bg-white/70 p-4 shadow-sm ring-1 ring-black/5">
          <h2 className="mb-2 text-lg font-semibold">Top 3 Prizes</h2>
          <ul className="space-y-2 text-sm">
            {PRIZES.map((p) => (
              <li key={p.place} className="flex items-center justify-between rounded-lg bg-emerald-600/10 px-3 py-2">
                <span>#{p.place}</span>
                <span>{p.prize}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-foreground/60">Prizes are illustrative for this demo UI.</p>
        </div>
      </aside>
    </div>
  );
}
