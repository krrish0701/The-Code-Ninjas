import { useEffect, useMemo, useRef, useState } from "react";
import { getReports, ReportItem } from "@/lib/store";
import { ensureLeaflet } from "@/lib/leaflet";

const SAMPLE: (ReportItem & { imageUrl?: string })[] = [
  { id: "s1", type: "Cutting", lat: -6.1754, lng: 106.8272, description: "Tree cutting near city center", createdAt: Date.now() - 86400000 },
  { id: "s2", type: "Dumping", lat: -6.2000, lng: 106.8451, description: "Plastic dumping along canal", createdAt: Date.now() - 3600000 * 12 },
  { id: "s3", type: "Reclamation", lat: -6.1400, lng: 106.8000, description: "Reclamation work on shoreline", createdAt: Date.now() - 3600000 * 36 },
  { id: "s4", type: "Sand Mining", lat: -6.1600, lng: 106.8200, description: "Illegal sand dredging reported", createdAt: Date.now() - 3600000 * 20 },
  { id: "s5", type: "Oil Spill", lat: -6.1900, lng: 106.8300, description: "Oil slick near harbor entrance", createdAt: Date.now() - 3600000 * 6 },
  { id: "s6", type: "Sewage Pollution", lat: -6.1300, lng: 106.8800, description: "Sewage discharge into creek", createdAt: Date.now() - 3600000 * 48 },
  { id: "s7", type: "Other", lat: -6.1200, lng: 106.9000, description: "Mangrove saplings uprooted", createdAt: Date.now() - 3600000 * 50 },
];

const TYPES = ["All", "Cutting", "Dumping", "Reclamation", "Sand Mining", "Oil Spill", "Sewage Pollution", "Other"] as const;

type TypeFilter = typeof TYPES[number];

type ColorCfg = { color: string; abbr: string };
const COLORS: Record<string, ColorCfg> = {
  "Cutting": { color: "#059669", abbr: "C" },
  "Dumping": { color: "#0d9488", abbr: "D" },
  "Reclamation": { color: "#0284c7", abbr: "R" },
  "Sand Mining": { color: "#d97706", abbr: "S" },
  "Oil Spill": { color: "#e11d48", abbr: "O" },
  "Sewage Pollution": { color: "#6d28d9", abbr: "P" },
  "Other": { color: "#64748b", abbr: "•" },
};

function svgDataUrl(type: string) {
  const { color, abbr } = COLORS[type] || COLORS.Other;
  const svg = `<?xml version='1.0' encoding='UTF-8'?>\n<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>\n  <defs>\n    <filter id='shadow' x='-50%' y='-50%' width='200%' height='200%'>\n      <feDropShadow dx='0' dy='1' stdDeviation='1' flood-color='rgba(0,0,0,0.3)'/>\n    </filter>\n  </defs>\n  <g filter='url(#shadow)'>\n    <circle cx='20' cy='20' r='12' fill='${color}' />\n    <text x='20' y='25' text-anchor='middle' font-size='14' font-family='Inter, Arial, sans-serif' fill='white'>${abbr}</text>\n  </g>\n</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

export default function MapView() {
  const [filter, setFilter] = useState<TypeFilter>("All");
  const userReports = getReports();
  const incidents = useMemo(() => {
    // enrich user reports missing image with placeholder for consistent UI
    return [...userReports.map(r => ({ ...r })), ...SAMPLE.map(s => ({ ...s, imageUrl: s.imageUrl || "/placeholder.svg" }))];
  }, [userReports]);
  const filtered = incidents.filter((r) => (filter === "All" ? true : r.type === filter));
  const [active, setActive] = useState<ReportItem | null>(filtered[0] ?? null);

  // Leaflet map setup
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const mapEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await ensureLeaflet();
      if (cancelled || !L || !mapEl.current) return;
      if (!mapRef.current) {
        mapRef.current = L.map(mapEl.current).setView([active?.lat ?? -6.1754, active?.lng ?? 106.8272], 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(mapRef.current);
      }
      // clear and redraw markers
      if (layerRef.current) layerRef.current.clearLayers();
      layerRef.current = L.layerGroup().addTo(mapRef.current);
      const bounds = L.latLngBounds([]);
      filtered.forEach((r: ReportItem) => {
        const icon = L.icon({ iconUrl: svgDataUrl(r.type), iconSize: [32, 32], iconAnchor: [16, 16] });
        const m = L.marker([r.lat, r.lng], { icon }).addTo(layerRef.current);
        const img = r.imageUrl ? `<br/><img src='${r.imageUrl}' style='width:160px;height:auto;border-radius:8px;margin-top:4px'/>` : "";
        m.bindPopup(`<strong>${r.type}</strong><br/>${r.description}${img}`);
        bounds.extend([r.lat, r.lng]);
        if (active && active.id === r.id) m.openPopup();
        m.on("click", () => setActive(r));
      });
      if (filtered.length > 0) {
        mapRef.current.fitBounds(bounds.pad(0.2));
      }
    })();
    return () => { cancelled = true; };
  }, [filtered, active]);

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <section className="md:col-span-3">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full px-3 py-1 text-sm ring-1 ring-inset ${filter === t ? "bg-primary text-primary-foreground" : "bg-white/70 text-foreground/80 ring-emerald-600/20"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <ul className="space-y-3">
          {filtered.map((r) => (
            <li key={r.id} className={`cursor-pointer rounded-xl border bg-white/70 p-4 shadow-sm ${active?.id === r.id ? "ring-2 ring-emerald-400" : ""}`} onClick={() => setActive(r)}>
              <div className="flex items-start gap-3">
                <img alt={r.type} src={r.imageUrl || svgDataUrl(r.type)} className="mt-1 h-16 w-24 rounded-md object-cover" />
                <div>
                  <div className="text-sm font-semibold">{r.type}</div>
                  <div className="text-sm text-foreground/70">{r.description}</div>
                  <div className="mt-1 text-xs text-foreground/60">{r.lat.toFixed(4)}, {r.lng.toFixed(4)} • {new Date(r.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </li>
          ))}
          {filtered.length === 0 && <li className="rounded-xl border bg-white/70 p-4 text-sm text-foreground/60">No incidents for this filter.</li>}
        </ul>
      </section>
      <aside className="md:col-span-2">
        <div className="overflow-hidden rounded-2xl border bg-white/70 shadow-sm ring-1 ring-black/5">
          <div ref={mapEl} className="h-[480px] w-full" />
        </div>
      </aside>
    </div>
  );
}
