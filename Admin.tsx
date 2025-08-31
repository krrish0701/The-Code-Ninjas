import { approvePending, getPendingApprovals, rejectPending } from "@/lib/store";
import { useEffect, useState } from "react";
import { CheckCircle2, Trash2, Mail } from "lucide-react";

export default function Admin() {
  const [items, setItems] = useState(getPendingApprovals());

  useEffect(() => {
    const onStorage = () => setItems(getPendingApprovals());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const approve = (id: string) => {
    const item = approvePending(id);
    setItems(getPendingApprovals());
    if (item) {
      const params = new URLSearchParams({ subject: item.subject, body: item.emailBody });
      window.location.href = `mailto:${item.recipientEmail || ""}?${params.toString()}`;
    }
  };

  const reject = (id: string) => {
    rejectPending(id);
    setItems(getPendingApprovals());
  };

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Admin Approvals</h1>
      {items.length === 0 ? (
        <p className="text-sm text-foreground/60">No pending items. Reports submitted for approval will appear here.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((it) => (
            <li key={it.id} className="flex items-start justify-between gap-4 rounded-2xl border bg-white/70 p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <img src={it.imageUrl || "/placeholder.svg"} alt="upload" className="h-24 w-32 rounded-md object-cover" />
                <div>
                  <div className="text-sm font-semibold">{it.type}</div>
                  <div className="text-sm text-foreground/70">{it.description}</div>
                  <div className="mt-1 text-xs text-foreground/60">{new Date(it.createdAt).toLocaleString()}</div>
                  <div className="mt-1 text-xs"><Mail className="mr-1 inline h-3 w-3"/> {it.recipientEmail || "<no recipient>"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => approve(it.id)} className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-3 py-2 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/20">
                  <CheckCircle2 className="h-3 w-3"/> Approve & Email
                </button>
                <button onClick={() => reject(it.id)} className="inline-flex items-center gap-1 rounded-full bg-red-600/10 px-3 py-2 text-xs font-semibold text-red-800 ring-1 ring-red-600/20">
                  <Trash2 className="h-3 w-3"/> Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
