import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, MapPin, Navigation2, Mail } from "lucide-react";
import { addPoints, addReport, IncidentType, setRole as saveRole, addPendingApproval, getPendingApprovals, getApprovedApprovals, getRejectedApprovals } from "@/lib/store";

const INCIDENT_TYPES = ["Cutting", "Dumping", "Reclamation", "Sand Mining", "Oil Spill", "Sewage Pollution", "Other"] as const;
const ROLES = ["Community", "NGO", "Govt", "Researcher"] as const;

export default function Report() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [photoName, setPhotoName] = useState<string>("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string>("");
  const [photoError, setPhotoError] = useState<string>("");
  const [type, setType] = useState<typeof INCIDENT_TYPES[number]>("Cutting");
  const [desc, setDesc] = useState("");
  const [role, setRole] = useState<typeof ROLES[number]>("Community");
  const [emailTo, setEmailTo] = useState<string>(() => localStorage.getItem("cmw_email_to") || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const [lastPendingId, setLastPendingId] = useState<string>(() => localStorage.getItem("cmw_last_pending_id") || "");
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "">("");

  const emailHref = (subject: string, body: string) => {
    const addr = emailTo.trim();
    const base = `mailto:${addr}`; // empty allowed; user can choose recipient in client
    const params = new URLSearchParams({ subject, body });
    return `${base}?${params.toString()}`;
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setCoords({ lat: -6.1754, lng: 106.8272 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setCoords({ lat: -6.1754, lng: 106.8272 }),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    const compute = () => {
      if (!lastPendingId) { setStatus(""); return; }
      if (getApprovedApprovals().some(a => a.id === lastPendingId)) setStatus("approved");
      else if (getRejectedApprovals().some(a => a.id === lastPendingId)) setStatus("rejected");
      else if (getPendingApprovals().some(a => a.id === lastPendingId)) setStatus("pending");
      else setStatus("");
    };
    compute();
    const onStorage = () => compute();
    window.addEventListener("storage", onStorage);
    const t = setInterval(compute, 1000);
    return () => { window.removeEventListener("storage", onStorage); clearInterval(t); };
  }, [lastPendingId]);

  const mapSrc = useMemo(() => {
    const lat = coords?.lat ?? -6.1754;
    const lng = coords?.lng ?? 106.8272;
    const delta = 0.005;
    const bbox = `${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}`;
    const marker = `&marker=${lat}%2C${lng}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${marker}`;
  }, [coords]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rId = `${Date.now()}`;
    if (coords) {
      addReport({ id: rId, type: type as IncidentType, lat: coords.lat, lng: coords.lng, description: desc || `${type} reported`, createdAt: Date.now(), imageUrl: photoDataUrl || undefined });
    }
    const next = addPoints(50);
    saveRole(role);
    toast.success("Incident submitted! Thank you for protecting mangroves.", {
      description: `${type} • ${role}${coords ? ` • ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : ""} �� +50 pts (Total ${next})`,
    });
    setPhotoName("");
    setDesc("");
  };

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <section className="md:col-span-3">
        <form onSubmit={onSubmit} className="grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Upload photo</label>
            <div
              className="group grid cursor-pointer place-items-center rounded-2xl border border-dashed bg-white/70 p-6 text-center transition hover:bg-white"
              onClick={() => inputRef.current?.click()}
            >
              <Camera className="mb-2 h-6 w-6 text-emerald-700" />
              <p className="text-sm text-foreground/70">Click to upload a photo</p>
              {photoName && <p className="mt-2 text-xs text-foreground/60">{photoName}</p>}
              {photoError && <p className="mt-2 text-xs text-red-600">{photoError}</p>}
              {photoDataUrl && <img src={photoDataUrl} alt="preview" className="mt-3 h-28 w-full max-w-xs rounded-xl object-cover" />}
              <p className="mt-1 text-[11px] text-foreground/50">Demo-only validation based on filename/description keywords.</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (!f.type.startsWith("image/")) {
                    setPhotoError("Please upload an image file.");
                    e.currentTarget.value = "";
                    return;
                  }
                  if (f.size > 8 * 1024 * 1024) {
                    setPhotoError("Image too large (max 8MB).");
                    e.currentTarget.value = "";
                    return;
                  }
                  const txt = `${f.name} ${desc}`.toLowerCase();
                  const keywords: Record<string, string[]> = {
                    "Cutting": ["cut", "axe", "chainsaw", "stump"],
                    "Dumping": ["dump", "trash", "garbage", "litter"],
                    "Reclamation": ["reclamation", "landfill", "bulldozer", "barge"],
                    "Sand Mining": ["sand", "mining", "dredge", "dredging"],
                    "Oil Spill": ["oil", "spill", "slick"],
                    "Sewage Pollution": ["sewage", "wastewater", "sewer", "drain"],
                  };
                  const list = (keywords as any)[type] as string[] | undefined;
                  if (type !== "Other" && list && !list.some((k) => txt.includes(k))) {
                    setPhotoError("Selected image seems unrelated to incident type (demo validation).");
                    e.currentTarget.value = "";
                    return;
                  }
                  setPhotoError("");
                  setPhotoName(f.name);
                  const reader = new FileReader();
                  reader.onload = () => setPhotoDataUrl(String(reader.result || ""));
                  reader.readAsDataURL(f);
                }}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Incident type</label>
              <select
                value={type}
                onChange={(e) => { setType(e.target.value as any); setPhotoError(""); }}
                className="w-full rounded-xl border bg-white/70 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {INCIDENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Your role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full rounded-xl border bg-white/70 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={5}
              placeholder="Describe what happened..."
              className="w-full resize-none rounded-xl border bg-white/70 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            <Navigation2 className="h-4 w-4" /> Submit Report
          </button>
        </form>
      </section>

      <aside className="md:col-span-2">
        <div className="mb-3 flex items-center gap-2 text-sm text-foreground/70">
          <MapPin className="h-4 w-4 text-emerald-700" />
          {coords ? (
            <span>
              GPS: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </span>
          ) : (
            <span>Detecting GPS...</span>
          )}
        </div>
        <div className="overflow-hidden rounded-2xl border bg-white/70 shadow-sm ring-1 ring-black/5">
          <iframe
            title="map"
            className="h-64 w-full md:h-[320px]"
            src={mapSrc}
          />
        </div>
        <div className="mt-4 rounded-2xl border bg-white/70 p-4 shadow-sm ring-1 ring-black/5">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium"><Mail className="h-4 w-4 text-emerald-700"/> Email reporting</div>
          <p className="text-sm text-foreground/80">Prefer email? Use this template and send it to your local NGO or forestry contact.</p>
          <pre className="mt-2 overflow-auto rounded-lg bg-emerald-600/10 p-2 text-xs">{`MangroveWatch\nType: ${type}\nGPS: ${coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "<lat>, <lng>"}\nDesc: ${desc || "<what happened>"}`}</pre>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              value={emailTo}
              onChange={(e) => { setEmailTo(e.target.value); localStorage.setItem("cmw_email_to", e.target.value); }}
              placeholder="Recipient email (e.g. ngo@example.org)"
              className="w-64 rounded-full border bg-white/70 px-3 py-2 text-xs shadow-sm"
              type="email"
            />
            <button
              onClick={() => {
                const body = `MangroveWatch\nType: ${type}\nGPS: ${coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "<lat>, <lng>"}\nDesc: ${desc || "<what happened>"}`;
                navigator.clipboard.writeText(body);
                toast.success("Email template copied");
              }}
              className="rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
            >
              Copy email template
            </button>
            <button
              onClick={() => {
                const subject = `MangroveWatch Incident: ${type}`;
                const body = `Type: ${type}\nGPS: ${coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "<lat>, <lng>"}\nDesc: ${desc || "<what happened>"}`;
                const id = `${Date.now()}-pending`;
                addPendingApproval({
                  id,
                  type: type as any,
                  lat: coords?.lat ?? 0,
                  lng: coords?.lng ?? 0,
                  description: desc || `${type} reported`,
                  createdAt: Date.now(),
                  imageUrl: photoDataUrl || undefined,
                  recipientEmail: emailTo,
                  subject,
                  emailBody: body,
                });
                localStorage.setItem("cmw_last_pending_id", id);
                setLastPendingId(id);
                setStatus("pending");
                toast.success("Submitted for admin approval");
              }}
              className="rounded-full bg-emerald-600/10 px-3 py-2 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/20"
            >
              Submit for admin approval
            </button>
          </div>
          <div className="mt-2 text-xs">
            {status === "pending" && <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 font-medium text-amber-900 ring-1 ring-amber-500/20">Pending admin review</span>}
            {status === "approved" && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 font-medium text-emerald-900 ring-1 ring-emerald-500/20">Approved</span>}
            {status === "rejected" && <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 font-medium text-red-900 ring-1 ring-red-500/20">Rejected</span>}
          </div>
          <p className="mt-2 text-xs text-foreground/60">After admin approval, your email will be prepared to send with the uploaded image attached manually.</p>
        </div>
      </aside>
    </div>
  );
}
