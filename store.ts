export type IncidentType = "Cutting" | "Dumping" | "Reclamation" | "Sand Mining" | "Oil Spill" | "Sewage Pollution" | "Other";

const PTS_KEY = "cmw_points";
const ROLE_KEY = "cmw_role";
const REPORTS_KEY = "cmw_reports";
const PENDING_KEY = "cmw_pending";
const APPROVED_KEY = "cmw_approved";
const REJECTED_KEY = "cmw_rejected";

export function getPoints(): number {
  const v = localStorage.getItem(PTS_KEY);
  return v ? Number(v) || 0 : 0;
}
export function addPoints(delta: number) {
  const next = getPoints() + delta;
  localStorage.setItem(PTS_KEY, String(next));
  return next;
}
export function setRole(role: string) {
  localStorage.setItem(ROLE_KEY, role);
}
export function getRole(): string | null {
  return localStorage.getItem(ROLE_KEY);
}
export interface ReportItem {
  id: string;
  type: IncidentType;
  lat: number;
  lng: number;
  description: string;
  createdAt: number;
  imageUrl?: string;
}
export function getReports(): ReportItem[] {
  const v = localStorage.getItem(REPORTS_KEY);
  return v ? (JSON.parse(v) as ReportItem[]) : [];
}
export function addReport(r: ReportItem) {
  const arr = getReports();
  arr.unshift(r);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(arr.slice(0, 50)));
}

export interface ApprovalItem extends ReportItem {
  recipientEmail: string;
  subject: string;
  emailBody: string;
}

export function getPendingApprovals(): ApprovalItem[] {
  const v = localStorage.getItem(PENDING_KEY);
  return v ? (JSON.parse(v) as ApprovalItem[]) : [];
}
export function addPendingApproval(item: ApprovalItem) {
  const arr = getPendingApprovals();
  arr.unshift(item);
  localStorage.setItem(PENDING_KEY, JSON.stringify(arr.slice(0, 100)));
}
export function removePendingApproval(id: string) {
  const arr = getPendingApprovals().filter((x) => x.id !== id);
  localStorage.setItem(PENDING_KEY, JSON.stringify(arr));
}
export function rejectPending(id: string) {
  const arr = getPendingApprovals();
  const idx = arr.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  const [item] = arr.splice(idx, 1);
  localStorage.setItem(PENDING_KEY, JSON.stringify(arr));
  const rejected = getRejectedApprovals();
  rejected.unshift(item);
  localStorage.setItem(REJECTED_KEY, JSON.stringify(rejected.slice(0, 200)));
  return item;
}
export function approvePending(id: string) {
  const arr = getPendingApprovals();
  const idx = arr.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  const [item] = arr.splice(idx, 1);
  localStorage.setItem(PENDING_KEY, JSON.stringify(arr));
  const approved = getApprovedApprovals();
  approved.unshift(item);
  localStorage.setItem(APPROVED_KEY, JSON.stringify(approved.slice(0, 200)));
  return item;
}
export function getApprovedApprovals(): ApprovalItem[] {
  const v = localStorage.getItem(APPROVED_KEY);
  return v ? (JSON.parse(v) as ApprovalItem[]) : [];
}
export function getRejectedApprovals(): ApprovalItem[] {
  const v = localStorage.getItem(REJECTED_KEY);
  return v ? (JSON.parse(v) as ApprovalItem[]) : [];
}
