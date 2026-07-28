import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  LayoutDashboard, Users, Stethoscope, CalendarDays, Boxes, Newspaper,
  Search, Bell, AlertTriangle, Clock, X, Activity,
  ArrowUpRight, ArrowDownRight, Pill, FlaskConical, HeartPulse,
  Syringe, Ambulance, Dumbbell, ChevronRight, MapPin, MoreHorizontal,
  Plus, ShieldCheck, Menu, Trash2, PhoneCall, MessageSquare, LogOut,
  UserPlus, CheckCircle2, Ban, ArrowRightLeft
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Tokens                                                              */
/* ------------------------------------------------------------------ */
const C = {
  bg: "#F4F7F6", surface: "#FFFFFF", surface2: "#EDF3F1",
  ink: "#0F2723", inkSoft: "#5B6F6A", inkFaint: "#93A29D",
  primary: "#0C4A43", primarySoft: "#E1EEEB",
  teal: "#187B6F", tealSoft: "#DCF0EB",
  urgent: "#B23A2E", urgentSoft: "#FBEAE7",
  amber: "#B5741F", amberSoft: "#FBF0DF",
  green: "#2E7D51", greenSoft: "#E4F3E9",
  border: "#DEE7E3", borderSoft: "#EAF0EE",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
`;

const uid = (p) => `${p}${Math.random().toString(36).slice(2, 8)}`;
const matches = (q, ...fields) =>
  !q || fields.some((f) => (f || "").toString().toLowerCase().includes(q.toLowerCase()));

/* ------------------------------------------------------------------ */
/* Seed data                                                           */
/* ------------------------------------------------------------------ */
const SEED_DOCTORS = [
  { id: "d1", name: "Dr. Amara Okafor", specialty: "Cardiology", status: "available", room: "204", next: "Now", init: "AO", color: C.teal },
  { id: "d2", name: "Dr. Liam Chen", specialty: "Emergency Medicine", status: "busy", room: "ER-2", next: "1:45 PM", init: "LC", color: C.urgent },
  { id: "d3", name: "Dr. Priya Nair", specialty: "Pediatrics", status: "available", room: "112", next: "Now", init: "PN", color: C.teal },
  { id: "d4", name: "Dr. Marcus Reyes", specialty: "Orthopedics", status: "off", room: "—", next: "Tomorrow, 9:00 AM", init: "MR", color: C.inkFaint },
  { id: "d5", name: "Dr. Sofia Bianchi", specialty: "Internal Medicine", status: "available", room: "108", next: "Now", init: "SB", color: C.teal },
  { id: "d6", name: "Dr. Kwame Asante", specialty: "Neurology", status: "busy", room: "301", next: "2:30 PM", init: "KA", color: C.urgent },
  { id: "d7", name: "Dr. Elena Petrova", specialty: "Dermatology", status: "available", room: "116", next: "Now", init: "EP", color: C.teal },
  { id: "d8", name: "Dr. Noah Bergström", specialty: "General Surgery", status: "busy", room: "OR-1", next: "4:00 PM", init: "NB", color: C.urgent },
];

const SEED_URGENT = [
  { id: "p1", name: "Harold Whitfield", age: 67, mrn: "MRN-88214", reason: "Chest pain, suspected NSTEMI", severity: "critical", doctor: "Dr. Amara Okafor", wait: "4 min", vitals: { hr: 112, bp: "162/98", spo2: "94%" }, notes: "Troponin pending. ECG shows ST depression in leads II, III, aVF." },
  { id: "p2", name: "Grace Muthoni", age: 34, mrn: "MRN-77031", reason: "Severe abdominal pain, guarding", severity: "high", doctor: "Dr. Liam Chen", wait: "9 min", vitals: { hr: 104, bp: "128/84", spo2: "98%" }, notes: "Awaiting abdominal CT. Rule out appendicitis." },
  { id: "p3", name: "Ibrahim Al-Sayed", age: 8, mrn: "MRN-90112", reason: "High fever, febrile seizure history", severity: "high", doctor: "Dr. Priya Nair", wait: "6 min", vitals: { hr: 128, bp: "96/60", spo2: "97%" }, notes: "Temp 39.8°C. Parent reports one seizure at home, 40 sec." },
  { id: "p4", name: "Dorothy Kessler", age: 81, mrn: "MRN-65590", reason: "Fall, possible hip fracture", severity: "moderate", doctor: "Dr. Marcus Reyes", wait: "15 min", vitals: { hr: 88, bp: "140/90", spo2: "96%" }, notes: "X-ray ordered. Pain controlled with initial analgesia." },
  { id: "p5", name: "Wei Tan", age: 45, mrn: "MRN-71298", reason: "Post-op fever, wound erythema", severity: "moderate", doctor: "Dr. Noah Bergström", wait: "12 min", vitals: { hr: 96, bp: "132/86", spo2: "97%" }, notes: "Day 3 post-appendectomy. Wound swab sent." },
  { id: "p6", name: "Renée Dubois", age: 29, mrn: "MRN-83467", reason: "Migraine with visual aura, first episode", severity: "low", doctor: "Dr. Kwame Asante", wait: "22 min", vitals: { hr: 78, bp: "118/76", spo2: "99%" }, notes: "No focal deficits. CT deferred pending neuro exam." },
];

const SEED_ROSTER = [
  { id: "r7", mrn: "MRN-55210", name: "Sarah Jennings", age: 52, doctor: "Dr. Sofia Bianchi", status: "Discharged", lastVisit: "Today, 8:00 AM" },
  { id: "r8", mrn: "MRN-49871", name: "Tomasz Wozniak", age: 60, doctor: "Dr. Amara Okafor", status: "Discharged", lastVisit: "Today, 8:30 AM" },
  { id: "r9", mrn: "MRN-30221", name: "Aiko Matsumoto", age: 41, doctor: "Dr. Elena Petrova", status: "Discharged", lastVisit: "Today, 9:15 AM" },
  { id: "r10", mrn: "MRN-61102", name: "Diego Fernandez", age: 5, doctor: "Dr. Priya Nair", status: "Waiting", lastVisit: "Today, 10:00 AM" },
];

const SEED_APPTS = [
  { id: "a1", time: "8:00 AM", patient: "Sarah Jennings", doctor: "Dr. Sofia Bianchi", type: "Annual physical", room: "108", status: "completed" },
  { id: "a2", time: "8:30 AM", patient: "Tomasz Wozniak", doctor: "Dr. Amara Okafor", type: "Follow-up · Cardiology", room: "204", status: "completed" },
  { id: "a3", time: "9:15 AM", patient: "Aiko Matsumoto", doctor: "Dr. Elena Petrova", type: "Skin consult", room: "116", status: "completed" },
  { id: "a4", time: "10:00 AM", patient: "Diego Fernandez", doctor: "Dr. Priya Nair", type: "Vaccination", room: "112", status: "in-progress" },
  { id: "a5", time: "10:45 AM", patient: "Naledi Mokoena", doctor: "Dr. Kwame Asante", type: "Neuro follow-up", room: "301", status: "upcoming" },
  { id: "a6", time: "11:30 AM", patient: "Owen Fitzgerald", doctor: "Dr. Sofia Bianchi", type: "Lab review", room: "108", status: "upcoming" },
  { id: "a7", time: "1:00 PM", patient: "Yuki Nakamura", doctor: "Dr. Amara Okafor", type: "Stress test", room: "204", status: "upcoming" },
  { id: "a8", time: "1:45 PM", patient: "Fatima Zahra", doctor: "Dr. Liam Chen", type: "Urgent walk-in", room: "ER-2", status: "upcoming" },
  { id: "a9", time: "2:30 PM", patient: "Callum Baird", doctor: "Dr. Kwame Asante", type: "MRI results", room: "301", status: "upcoming" },
  { id: "a10", time: "3:15 PM", patient: "Priya Deshmukh", doctor: "Dr. Elena Petrova", type: "Biopsy follow-up", room: "116", status: "cancelled" },
];

const SEED_NEWS = [
  { id: "n1", title: "New triage protocol goes live Monday", date: "Jul 25", category: "Policy", excerpt: "Updated ESI-based triage scoring rolls out clinic-wide, replacing the 2022 intake form.", body: "Starting Monday, all intake staff will use the revised 5-level Emergency Severity Index scoring sheet. Training sessions are scheduled Thu/Fri in the east conference room." },
  { id: "n2", title: "Flu vaccine shipment arrived — 400 doses", date: "Jul 24", category: "Supplies", excerpt: "Pharmacy has received this season's allocation. Walk-in vaccination slots open next week.", body: "The pharmacy received 400 doses of the quadrivalent flu vaccine this morning. Front desk can begin booking walk-in slots starting Aug 3." },
  { id: "n3", title: "Reminder: Q3 staff meeting Thursday 7 AM", date: "Jul 23", category: "Staff", excerpt: "Mandatory all-hands covering scheduling changes and the new EHR module.", body: "All clinical staff are asked to attend Thursday's 7:00 AM meeting in the main auditorium." },
  { id: "n4", title: "Radiology wing renovation begins Aug 1", date: "Jul 22", category: "Facilities", excerpt: "Imaging services will temporarily relocate to the west annex during construction.", body: "Renovation of the radiology wing begins August 1 and is expected to run six weeks. Imaging moves to the west annex, ground floor." },
];

const SEED_SERVICES = [
  { id: "s1", name: "Radiology & Imaging", icon: "Activity", desc: "X-ray, CT, MRI, ultrasound", status: "Open", queue: 3 },
  { id: "s2", name: "Pharmacy", icon: "Pill", desc: "Prescriptions & refills", status: "Open", queue: 6 },
  { id: "s3", name: "Laboratory", icon: "FlaskConical", desc: "Blood work & diagnostics", status: "Open", queue: 4 },
  { id: "s4", name: "Emergency Department", icon: "Ambulance", desc: "Urgent & trauma care", status: "Open", queue: 9 },
  { id: "s5", name: "Physiotherapy", icon: "Dumbbell", desc: "Rehab & mobility care", status: "Open", queue: 1 },
  { id: "s6", name: "Vaccination Clinic", icon: "Syringe", desc: "Immunizations", status: "Open", queue: 2 },
];

const ICONS = { Activity, Pill, FlaskConical, Ambulance, Dumbbell, Syringe, Boxes };

const SEVERITY_STYLE = {
  critical: { bg: C.urgentSoft, fg: C.urgent, label: "Critical" },
  high: { bg: C.amberSoft, fg: C.amber, label: "High" },
  moderate: { bg: C.tealSoft, fg: C.teal, label: "Moderate" },
  low: { bg: C.surface2, fg: C.inkSoft, label: "Low" },
};

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "patients", label: "Patients", icon: Users },
  { id: "doctors", label: "Doctors", icon: Stethoscope },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "services", label: "Services", icon: Boxes },
  { id: "news", label: "News", icon: Newspaper },
];

/* ------------------------------------------------------------------ */
/* Toasts                                                              */
/* ------------------------------------------------------------------ */
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = (msg, tone = "ok") => {
    const id = uid("t");
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };
  return { toasts, push };
}

function ToastStack({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 100, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: t.tone === "error" ? C.urgent : C.primary, color: "#fff",
            padding: "11px 16px", borderRadius: 10, fontFamily: "Inter, sans-serif",
            fontSize: 13, fontWeight: 600, boxShadow: "0 8px 24px #0F272333",
            display: "flex", alignItems: "center", gap: 8, minWidth: 200,
            animation: "toastIn .18s ease",
          }}
        >
          <CheckCircle2 size={15} />
          {t.msg}
        </div>
      ))}
      <style>{`@keyframes toastIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */
function StatusDot({ status }) {
  const map = {
    available: C.green, busy: C.amber, off: C.inkFaint,
    completed: C.green, "in-progress": C.amber, upcoming: C.teal, cancelled: C.inkFaint,
    Open: C.green, Closed: C.inkFaint,
  };
  return <span style={{ width: 8, height: 8, borderRadius: 999, background: map[status] || C.inkFaint, display: "inline-block", flexShrink: 0 }} />;
}

function Pill_({ children, bg, fg, style }) {
  return (
    <span style={{ background: bg, color: fg, fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 999, whiteSpace: "nowrap", fontFamily: "Inter, sans-serif", ...style }}>
      {children}
    </span>
  );
}

function Avatar({ initials, color, size = 36 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color + "1A", color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: size * 0.36, flexShrink: 0, border: `1.5px solid ${color}33` }}>
      {initials}
    </div>
  );
}

function IconBtn({ icon: Icon, onClick, title, tone }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`,
        background: C.surface, display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: tone === "danger" ? C.urgent : C.inkSoft, flexShrink: 0,
      }}
    >
      <Icon size={14} />
    </button>
  );
}

function PrimaryBtn({ children, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 7, background: C.primary, color: "#fff",
        border: "none", borderRadius: 10, padding: "9px 14px", fontFamily: "Inter, sans-serif",
        fontWeight: 600, fontSize: 13, cursor: "pointer", flexShrink: 0,
      }}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
      <div>
        <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: 17, color: C.ink, margin: 0 }}>{title}</h2>
        {subtitle && <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2, fontFamily: "Inter, sans-serif" }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

function EmptyRow({ text }) {
  return <div style={{ padding: "22px 8px", textAlign: "center", color: C.inkFaint, fontSize: 13, fontFamily: "Inter, sans-serif" }}>{text}</div>;
}

/* Field controls used inside modals */
function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, fontFamily: "Inter, sans-serif" }}>
      <span style={{ fontSize: 11.5, color: C.inkSoft, fontWeight: 600 }}>{label}</span>
      {children}
    </label>
  );
}
const inputStyle = {
  border: `1px solid ${C.border}`, borderRadius: 9, padding: "9px 10px", fontSize: 13,
  fontFamily: "Inter, sans-serif", color: C.ink, background: C.surface, width: "100%",
};

/* ------------------------------------------------------------------ */
/* Modal shell                                                         */
/* ------------------------------------------------------------------ */
function Modal({ title, onClose, children, width = 440 }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "#0F272380" }} />
      <div style={{ position: "relative", width: `min(${width}px, 100%)`, background: C.surface, borderRadius: 16, padding: 22, boxShadow: "0 20px 50px #0F272340", maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 17, margin: 0, color: C.ink }}>{title}</h3>
          <button onClick={onClose} style={{ border: "none", background: C.surface2, borderRadius: 999, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={15} color={C.inkSoft} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Signature vitals ticker                                             */
/* ------------------------------------------------------------------ */
function VitalsTicker({ urgentCount, availableCount, totalDoctors }) {
  const speed = Math.max(2.6, 6 - urgentCount * 0.5);
  return (
    <div style={{ background: C.primary, borderRadius: 14, padding: "14px 20px", display: "flex", alignItems: "center", gap: 16, overflow: "hidden", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, zIndex: 1 }}>
        <HeartPulse size={17} color="#fff" />
        <span style={{ color: "#fff", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: 13.5 }}>Ward pulse</span>
      </div>
      <div style={{ flex: 1, height: 34, position: "relative" }}>
        <svg viewBox="0 0 600 40" preserveAspectRatio="none" style={{ width: "200%", height: "100%", position: "absolute", left: 0, animation: `ekgScroll ${speed}s linear infinite` }}>
          <polyline
            points="0,20 40,20 55,20 62,6 68,34 74,20 90,20 130,20 145,20 152,6 158,34 164,20 180,20 220,20 235,20 242,6 248,34 254,20 270,20 310,20 325,20 332,6 338,34 344,20 360,20 400,20 415,20 422,6 428,34 434,20 450,20 490,20 505,20 512,6 518,34 524,20 540,20 580,20 595,20 602,6 608,34 614,20 630,20"
            fill="none" stroke="#8FD9C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>
      <div style={{ display: "flex", gap: 18, flexShrink: 0, zIndex: 1 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#fff", fontFamily: "IBM Plex Mono, monospace", fontWeight: 600, fontSize: 15 }}>{urgentCount}</div>
          <div style={{ color: "#ffffffa0", fontSize: 10.5, fontFamily: "Inter, sans-serif" }}>urgent now</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#fff", fontFamily: "IBM Plex Mono, monospace", fontWeight: 600, fontSize: 15 }}>{availableCount}/{totalDoctors}</div>
          <div style={{ color: "#ffffffa0", fontSize: 10.5, fontFamily: "Inter, sans-serif" }}>doctors free</div>
        </div>
      </div>
      <style>{`@keyframes ekgScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

function StatCard({ label, value, delta, deltaDir, icon: Icon, tint }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: tint + "17", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} color={tint} />
        </div>
        {delta != null && (
          <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 12, fontWeight: 600, color: deltaDir === "up" ? C.green : C.urgent, fontFamily: "Inter, sans-serif" }}>
            {deltaDir === "up" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{delta}
          </span>
        )}
      </div>
      <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 26, color: C.ink, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 3, fontFamily: "Inter, sans-serif" }}>{label}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Urgent cases panel + drawer                                         */
/* ------------------------------------------------------------------ */
function UrgentCasesPanel({ cases, onSelect, query, onNew }) {
  const filtered = cases.filter((p) => matches(query, p.name, p.mrn, p.reason, p.doctor));
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
      <SectionHeader
        title="Urgent cases"
        subtitle={`${filtered.length} patients flagged for immediate attention`}
        action={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Pill_ bg={C.urgentSoft} fg={C.urgent}>Live</Pill_>
            {onNew && <PrimaryBtn icon={Plus} onClick={onNew}>Add patient</PrimaryBtn>}
          </div>
        }
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 && <EmptyRow text="No urgent cases match your search." />}
        {filtered.map((p) => {
          const sev = SEVERITY_STYLE[p.severity];
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", border: `1px solid ${C.borderSoft}`, borderRadius: 12, background: C.bg, cursor: "pointer", textAlign: "left", width: "100%" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.surface2)}
              onMouseLeave={(e) => (e.currentTarget.style.background = C.bg)}
            >
              <div style={{ width: 4, alignSelf: "stretch", borderRadius: 4, background: sev.fg, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: C.ink }}>{p.name}</span>
                  <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: C.inkFaint }}>{p.mrn}</span>
                  <Pill_ bg={sev.bg} fg={sev.fg}>{sev.label}</Pill_>
                </div>
                <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 3, fontFamily: "Inter, sans-serif" }}>{p.reason}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 11.5, color: C.inkFaint, fontFamily: "Inter, sans-serif" }}>{p.doctor.replace("Dr. ", "")}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", color: C.urgent, fontFamily: "IBM Plex Mono, monospace", fontSize: 12, fontWeight: 600, marginTop: 2 }}>
                  <Clock size={11} /> {p.wait}
                </div>
              </div>
              <ChevronRight size={16} color={C.inkFaint} style={{ flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PatientDrawer({ patient, onClose, doctors, onAssignDoctor, onDischarge }) {
  if (!patient) return null;
  const sev = SEVERITY_STYLE[patient.severity];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "#0F272380" }} />
      <div style={{ position: "relative", width: "min(420px, 92vw)", background: C.surface, height: "100%", boxShadow: "-8px 0 30px #0F272322", padding: 24, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <Pill_ bg={sev.bg} fg={sev.fg} style={{ marginBottom: 8, display: "inline-block" }}>{sev.label} priority</Pill_>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 20, fontWeight: 700, color: C.ink, margin: 0 }}>{patient.name}</h2>
            <div style={{ fontSize: 12.5, color: C.inkSoft, fontFamily: "IBM Plex Mono, monospace", marginTop: 3 }}>{patient.mrn} · Age {patient.age}</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: C.surface2, borderRadius: 999, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color={C.inkSoft} />
          </button>
        </div>

        <div style={{ background: C.bg, border: `1px solid ${C.borderSoft}`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 11.5, color: C.inkFaint, fontFamily: "Inter, sans-serif", marginBottom: 6, textTransform: "uppercase" }}>Reason for visit</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: C.ink }}>{patient.reason}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
          {[{ label: "Heart rate", value: `${patient.vitals.hr}` }, { label: "Blood pressure", value: patient.vitals.bp }, { label: "SpO₂", value: patient.vitals.spo2 }].map((v) => (
            <div key={v.label} style={{ border: `1px solid ${C.borderSoft}`, borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontWeight: 600, fontSize: 15, color: C.primary }}>{v.value}</div>
              <div style={{ fontSize: 10, color: C.inkFaint, fontFamily: "Inter, sans-serif", marginTop: 2 }}>{v.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11.5, color: C.inkFaint, fontFamily: "Inter, sans-serif", marginBottom: 6, textTransform: "uppercase" }}>Clinical notes</div>
          <div style={{ fontSize: 13, color: C.inkSoft, fontFamily: "Inter, sans-serif", lineHeight: 1.55 }}>{patient.notes}</div>
        </div>

        <Field label="Assigned physician">
          <select value={patient.doctor} onChange={(e) => onAssignDoctor(patient.id, e.target.value)} style={inputStyle}>
            {doctors.map((d) => <option key={d.id} value={d.name}>{d.name} · {d.specialty}</option>)}
          </select>
        </Field>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={() => { onDischarge(patient.id); onClose(); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.primary, color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            <LogOut size={14} /> Discharge patient
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Doctors                                                             */
/* ------------------------------------------------------------------ */
function DoctorAvailabilityPanel({ doctors, onToggle, onSelect, query }) {
  const order = { available: 0, busy: 1, off: 2 };
  const filtered = doctors.filter((d) => matches(query, d.name, d.specialty)).sort((a, b) => order[a.status] - order[b.status]);
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, height: "100%" }}>
      <SectionHeader title="Doctor availability" subtitle={`${doctors.filter((d) => d.status === "available").length} available now`} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {filtered.length === 0 && <EmptyRow text="No doctors match your search." />}
        {filtered.map((d) => (
          <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", borderRadius: 10 }}>
            <button onClick={() => onSelect(d)} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0, background: "transparent", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
              <Avatar initials={d.init} color={d.color} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                <div style={{ fontSize: 11.5, color: C.inkSoft, fontFamily: "Inter, sans-serif" }}>{d.specialty}</div>
              </div>
            </button>
            <button onClick={() => onToggle(d.id)} style={{ display: "flex", alignItems: "center", gap: 5, border: "none", cursor: "pointer", background: "transparent", padding: "4px 8px", borderRadius: 999 }} title="Toggle status">
              <StatusDot status={d.status} />
              <span style={{ fontSize: 11, fontFamily: "Inter, sans-serif", color: C.inkSoft, textTransform: "capitalize" }}>{d.status === "off" ? "Off duty" : d.status}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorDrawer({ doctor, onClose, onToggle, appts, onRemove }) {
  if (!doctor) return null;
  const schedule = appts.filter((a) => a.doctor === doctor.name);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "#0F272380" }} />
      <div style={{ position: "relative", width: "min(420px, 92vw)", background: C.surface, height: "100%", boxShadow: "-8px 0 30px #0F272322", padding: 24, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Avatar initials={doctor.init} color={doctor.color} size={46} />
            <div>
              <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 18, fontWeight: 700, color: C.ink, margin: 0 }}>{doctor.name}</h2>
              <div style={{ fontSize: 12.5, color: C.inkSoft, fontFamily: "Inter, sans-serif" }}>{doctor.specialty}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: C.surface2, borderRadius: 999, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color={C.inkSoft} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          <Pill_ bg={C.surface2} fg={C.inkSoft}><MapPin size={10} style={{ display: "inline", marginRight: 3, verticalAlign: -1 }} />Room {doctor.room}</Pill_>
          <Pill_ bg={C.surface2} fg={C.inkSoft}>{schedule.length} appts today</Pill_>
          <Pill_ bg={C.tealSoft} fg={C.teal}>Next: {doctor.next}</Pill_>
        </div>

        <button onClick={() => onToggle(doctor.id)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: `1px solid ${C.border}`, background: C.bg, borderRadius: 10, padding: "10px 0", cursor: "pointer", marginBottom: 12 }}>
          <StatusDot status={doctor.status} />
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: C.ink, textTransform: "capitalize" }}>
            {doctor.status === "off" ? "Off duty — set as available" : `Currently ${doctor.status} — cycle status`}
          </span>
        </button>

        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: `1px solid ${C.border}`, background: C.surface, borderRadius: 10, padding: "10px 0", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, color: C.inkSoft }}>
            <PhoneCall size={13} /> Call
          </button>
          <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: `1px solid ${C.border}`, background: C.surface, borderRadius: 10, padding: "10px 0", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, color: C.inkSoft }}>
            <MessageSquare size={13} /> Message
          </button>
        </div>

        <div style={{ fontSize: 11.5, color: C.inkFaint, fontFamily: "Inter, sans-serif", marginBottom: 8, textTransform: "uppercase" }}>Today's schedule</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
          {schedule.length === 0 && <EmptyRow text="No appointments scheduled." />}
          {schedule.map((a) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: `1px solid ${C.borderSoft}`, borderRadius: 10 }}>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11.5, color: C.inkSoft, width: 58 }}>{a.time}</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.ink, flex: 1 }}>{a.patient}</span>
              <StatusDot status={a.status} />
            </div>
          ))}
        </div>

        <button onClick={() => { onRemove(doctor.id); onClose(); }} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "transparent", color: C.urgent, border: `1px solid ${C.urgentSoft}`, borderRadius: 10, padding: "10px 0", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <Trash2 size={14} /> Remove from staff list
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Appointments                                                        */
/* ------------------------------------------------------------------ */
function AppointmentsPanel({ appts, onCycleStatus, onCancel, onRemove, query, onNew }) {
  const nextLabel = { upcoming: "Upcoming", "in-progress": "In progress", completed: "Completed", cancelled: "Cancelled" };
  const filtered = appts.filter((a) => matches(query, a.patient, a.doctor, a.type));
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
      <SectionHeader
        title="Today's appointments"
        subtitle={`${filtered.length} scheduled · click status to update`}
        action={onNew && <PrimaryBtn icon={Plus} onClick={onNew}>New appointment</PrimaryBtn>}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {filtered.length === 0 && <EmptyRow text="No appointments match your search." />}
        {filtered.map((a, i) => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 4px", borderTop: i === 0 ? "none" : `1px solid ${C.borderSoft}`, flexWrap: "wrap" }}>
            <div style={{ width: 62, flexShrink: 0, fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: C.inkSoft }}>{a.time}</div>
            <div style={{ width: 3, height: 32, borderRadius: 3, background: a.status === "cancelled" ? C.inkFaint : C.teal, flexShrink: 0, opacity: a.status === "cancelled" ? 0.4 : 1 }} />
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: a.status === "cancelled" ? C.inkFaint : C.ink, textDecoration: a.status === "cancelled" ? "line-through" : "none" }}>{a.patient}</div>
              <div style={{ fontSize: 12, color: C.inkSoft, fontFamily: "Inter, sans-serif" }}>{a.type} · {a.doctor} · Rm {a.room}</div>
            </div>
            <button
              onClick={() => a.status !== "cancelled" && onCycleStatus(a.id)}
              disabled={a.status === "cancelled"}
              style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${C.border}`, background: C.bg, borderRadius: 999, padding: "5px 10px", cursor: a.status === "cancelled" ? "default" : "pointer", fontFamily: "Inter, sans-serif", fontSize: 11.5, color: C.inkSoft, flexShrink: 0 }}
            >
              <StatusDot status={a.status} />{nextLabel[a.status]}
            </button>
            {a.status !== "cancelled" ? (
              <IconBtn icon={Ban} title="Cancel appointment" tone="danger" onClick={() => onCancel(a.id)} />
            ) : (
              <IconBtn icon={Trash2} title="Remove" tone="danger" onClick={() => onRemove(a.id)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AddAppointmentForm({ doctors, onSubmit, onClose }) {
  const [time, setTime] = useState("9:00 AM");
  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState(doctors[0]?.name || "");
  const [type, setType] = useState("");
  const [room, setRoom] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Field label="Patient name"><input style={inputStyle} value={patient} onChange={(e) => setPatient(e.target.value)} placeholder="e.g. Jordan Ellis" /></Field>
      <Field label="Time"><input style={inputStyle} value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 2:00 PM" /></Field>
      <Field label="Doctor">
        <select style={inputStyle} value={doctor} onChange={(e) => setDoctor(e.target.value)}>
          {doctors.map((d) => <option key={d.id} value={d.name}>{d.name} · {d.specialty}</option>)}
        </select>
      </Field>
      <Field label="Visit type"><input style={inputStyle} value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. Follow-up · Cardiology" /></Field>
      <Field label="Room"><input style={inputStyle} value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. 204" /></Field>
      <PrimaryBtn
        onClick={() => {
          if (!patient.trim()) return;
          onSubmit({ id: uid("a"), time, patient, doctor, type: type || "General visit", room: room || "—", status: "upcoming" });
          onClose();
        }}
      >
        Schedule appointment
      </PrimaryBtn>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Patients view                                                       */
/* ------------------------------------------------------------------ */
function PatientsView({ urgentCases, roster, doctors, query, onSelectPatient, onNewPatient, onAdmit, onDischargeRoster }) {
  const filteredRoster = roster.filter((r) => matches(query, r.name, r.mrn, r.doctor, r.status));
  const [menuFor, setMenuFor] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <UrgentCasesPanel cases={urgentCases} onSelect={onSelectPatient} query={query} onNew={onNewPatient} />
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
        <SectionHeader title="Patient roster" subtitle={`${filteredRoster.length} patients on record today`} />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: `1px solid ${C.border}` }}>
                {["MRN", "Patient", "Age", "Doctor", "Status", "Last visit", ""].map((h) => (
                  <th key={h} style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: C.inkFaint, fontWeight: 600, padding: "0 10px 10px", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRoster.length === 0 && (
                <tr><td colSpan={7}><EmptyRow text="No patients match your search." /></td></tr>
              )}
              {filteredRoster.map((r) => (
                <tr key={r.id} style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
                  <td style={{ padding: "10px", fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: C.inkSoft }}>{r.mrn}</td>
                  <td style={{ padding: "10px", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: C.ink }}>{r.name}</td>
                  <td style={{ padding: "10px", fontFamily: "Inter, sans-serif", fontSize: 13, color: C.inkSoft }}>{r.age}</td>
                  <td style={{ padding: "10px", fontFamily: "Inter, sans-serif", fontSize: 13, color: C.inkSoft }}>{r.doctor}</td>
                  <td style={{ padding: "10px" }}>
                    <Pill_ bg={r.status === "Discharged" ? C.surface2 : C.tealSoft} fg={r.status === "Discharged" ? C.inkSoft : C.teal}>{r.status}</Pill_>
                  </td>
                  <td style={{ padding: "10px", fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.inkFaint }}>{r.lastVisit}</td>
                  <td style={{ padding: "10px", position: "relative" }}>
                    <IconBtn icon={MoreHorizontal} title="Actions" onClick={() => setMenuFor(menuFor === r.id ? null : r.id)} />
                    {menuFor === r.id && (
                      <div style={{ position: "absolute", right: 10, top: 40, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: "0 10px 26px #0F272326", zIndex: 5, minWidth: 170, overflow: "hidden" }}>
                        {r.status !== "Discharged" && (
                          <button onClick={() => { onAdmit(r); setMenuFor(null); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 12px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.ink, textAlign: "left" }}>
                            <AlertTriangle size={13} color={C.urgent} /> Admit as urgent
                          </button>
                        )}
                        {r.status !== "Discharged" && (
                          <button onClick={() => { onDischargeRoster(r.id); setMenuFor(null); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 12px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.ink, textAlign: "left" }}>
                            <LogOut size={13} color={C.inkSoft} /> Discharge
                          </button>
                        )}
                        {r.status === "Discharged" && <div style={{ padding: "9px 12px", fontSize: 12, color: C.inkFaint, fontFamily: "Inter, sans-serif" }}>No actions available</div>}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AddPatientForm({ doctors, onSubmit, onClose }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [reason, setReason] = useState("");
  const [severity, setSeverity] = useState("moderate");
  const [doctor, setDoctor] = useState(doctors[0]?.name || "");
  const [urgent, setUrgent] = useState(true);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Field label="Patient name"><input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jordan Ellis" /></Field>
      <Field label="Age"><input style={inputStyle} value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 42" /></Field>
      <Field label="Reason for visit"><input style={inputStyle} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Shortness of breath" /></Field>
      <Field label="Assign doctor">
        <select style={inputStyle} value={doctor} onChange={(e) => setDoctor(e.target.value)}>
          {doctors.map((d) => <option key={d.id} value={d.name}>{d.name} · {d.specialty}</option>)}
        </select>
      </Field>
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.inkSoft }}>
        <input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} />
        Flag as urgent case
      </label>
      {urgent && (
        <Field label="Severity">
          <select style={inputStyle} value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
          </select>
        </Field>
      )}
      <PrimaryBtn
        onClick={() => {
          if (!name.trim()) return;
          onSubmit({ name, age: age || "—", reason: reason || "Not specified", severity, doctor, urgent });
          onClose();
        }}
      >
        Add patient
      </PrimaryBtn>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Doctors view                                                        */
/* ------------------------------------------------------------------ */
function DoctorsView({ doctors, onToggle, onSelect, query, onNew }) {
  const filtered = doctors.filter((d) => matches(query, d.name, d.specialty));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <PrimaryBtn icon={Plus} onClick={onNew}>Add doctor</PrimaryBtn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {filtered.length === 0 && <EmptyRow text="No doctors match your search." />}
        {filtered.map((d) => (
          <div key={d.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
            <button onClick={() => onSelect(d)} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, width: "100%", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
              <Avatar initials={d.init} color={d.color} size={44} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: 14.5, color: C.ink }}>{d.name}</div>
                <div style={{ fontSize: 12, color: C.inkSoft, fontFamily: "Inter, sans-serif" }}>{d.specialty}</div>
              </div>
              <ChevronRight size={16} color={C.inkFaint} />
            </button>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <Pill_ bg={C.surface2} fg={C.inkSoft}><MapPin size={10} style={{ display: "inline", marginRight: 3, verticalAlign: -1 }} />Room {d.room}</Pill_>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: `1px solid ${C.borderSoft}` }}>
              <div style={{ fontSize: 12, color: C.inkSoft, fontFamily: "Inter, sans-serif" }}>Next slot: <b style={{ color: C.ink }}>{d.next}</b></div>
              <button onClick={() => onToggle(d.id)} style={{ display: "flex", alignItems: "center", gap: 5, border: `1px solid ${C.border}`, background: C.bg, borderRadius: 999, padding: "4px 9px", cursor: "pointer" }}>
                <StatusDot status={d.status} />
                <span style={{ fontSize: 11.5, fontFamily: "Inter, sans-serif", color: C.inkSoft, textTransform: "capitalize" }}>{d.status === "off" ? "Off duty" : d.status}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddDoctorForm({ onSubmit, onClose }) {
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [room, setRoom] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Field label="Full name"><input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dr. Jane Okoro" /></Field>
      <Field label="Specialty"><input style={inputStyle} value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="e.g. Endocrinology" /></Field>
      <Field label="Room"><input style={inputStyle} value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. 210" /></Field>
      <PrimaryBtn
        onClick={() => {
          if (!name.trim()) return;
          onSubmit({ name: name.startsWith("Dr.") ? name : `Dr. ${name}`, specialty: specialty || "General Medicine", room: room || "—" });
          onClose();
        }}
      >
        Add doctor
      </PrimaryBtn>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Appointments view                                                    */
/* ------------------------------------------------------------------ */
function AppointmentsView({ appts, onCycleStatus, onCancel, onRemove, query, onNew }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? appts : appts.filter((a) => a.status === filter);
  const tabs = [
    { id: "all", label: "All" }, { id: "upcoming", label: "Upcoming" }, { id: "in-progress", label: "In progress" },
    { id: "completed", label: "Completed" }, { id: "cancelled", label: "Cancelled" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setFilter(t.id)} style={{ border: `1px solid ${filter === t.id ? C.primary : C.border}`, background: filter === t.id ? C.primary : C.surface, color: filter === t.id ? "#fff" : C.inkSoft, borderRadius: 999, padding: "7px 14px", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>
            {t.label}
          </button>
        ))}
      </div>
      <AppointmentsPanel appts={filtered} onCycleStatus={onCycleStatus} onCancel={onCancel} onRemove={onRemove} query={query} onNew={onNew} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Services                                                             */
/* ------------------------------------------------------------------ */
function ServicesStrip({ services, onCallNext, onToggleStatus, query, onNew, compact }) {
  const filtered = services.filter((s) => matches(query, s.name, s.desc));
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
      <SectionHeader title="Services" subtitle="Quick access to clinic departments" action={onNew && <PrimaryBtn icon={Plus} onClick={onNew}>Add service</PrimaryBtn>} />
      <div style={{ display: "grid", gridTemplateColumns: compact ? "repeat(auto-fit, minmax(140px, 1fr))" : "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
        {filtered.length === 0 && <EmptyRow text="No services match your search." />}
        {filtered.map((s) => {
          const Icon = ICONS[s.icon] || Boxes;
          return (
            <div key={s.id} style={{ display: "flex", flexDirection: "column", gap: 10, padding: 14, borderRadius: 12, border: `1px solid ${C.borderSoft}`, background: C.bg }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: C.tealSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={17} color={C.teal} />
                </div>
                <button onClick={() => onToggleStatus(s.id)} style={{ border: "none", background: "transparent", cursor: "pointer" }} title="Toggle open/closed">
                  <Pill_ bg={s.status === "Open" ? C.greenSoft : C.surface2} fg={s.status === "Open" ? C.green : C.inkSoft}>{s.status}</Pill_>
                </button>
              </div>
              <div>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: C.ink }}>{s.name}</div>
                <div style={{ fontSize: 11.5, color: C.inkSoft, fontFamily: "Inter, sans-serif" }}>{s.desc}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                <span style={{ fontSize: 11, color: C.inkFaint, fontFamily: "IBM Plex Mono, monospace" }}>queue {s.queue}</span>
                <button onClick={() => onCallNext(s.id)} disabled={s.queue === 0} style={{ border: `1px solid ${C.border}`, background: C.surface, borderRadius: 999, padding: "4px 10px", fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: s.queue === 0 ? C.inkFaint : C.inkSoft, cursor: s.queue === 0 ? "default" : "pointer" }}>
                  Call next
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AddServiceForm({ onSubmit, onClose }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Field label="Service name"><input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Nutrition Counseling" /></Field>
      <Field label="Description"><input style={inputStyle} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Diet plans & consults" /></Field>
      <PrimaryBtn onClick={() => { if (!name.trim()) return; onSubmit({ name, desc: desc || "Clinic service" }); onClose(); }}>
        Add service
      </PrimaryBtn>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* News                                                                 */
/* ------------------------------------------------------------------ */
function NewsPanel({ news, expanded, setExpanded, onDelete, query, onNew }) {
  const filtered = news.filter((n) => matches(query, n.title, n.category, n.excerpt));
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
      <SectionHeader title="Clinic news" subtitle="Announcements & updates" action={onNew && <PrimaryBtn icon={Plus} onClick={onNew}>New announcement</PrimaryBtn>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && <EmptyRow text="No announcements match your search." />}
        {filtered.map((n) => {
          const isOpen = expanded === n.id;
          return (
            <div key={n.id} style={{ border: `1px solid ${C.borderSoft}`, borderRadius: 12, padding: "12px 13px", background: C.bg }}>
              <div style={{ display: "flex", width: "100%", gap: 10 }}>
                <button onClick={() => setExpanded(isOpen ? null : n.id)} style={{ flex: 1, minWidth: 0, display: "flex", gap: 10, background: "transparent", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <Pill_ bg={C.primarySoft} fg={C.primary}>{n.category}</Pill_>
                      <span style={{ fontSize: 11, color: C.inkFaint, fontFamily: "IBM Plex Mono, monospace" }}>{n.date}</span>
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: C.ink }}>{n.title}</div>
                    {!isOpen && <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 3, fontFamily: "Inter, sans-serif" }}>{n.excerpt}</div>}
                  </div>
                  <ChevronRight size={15} color={C.inkFaint} style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .15s", flexShrink: 0, marginTop: 3 }} />
                </button>
                {onDelete && <IconBtn icon={Trash2} tone="danger" title="Delete announcement" onClick={() => onDelete(n.id)} />}
              </div>
              {isOpen && <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 8, lineHeight: 1.5, fontFamily: "Inter, sans-serif" }}>{n.body}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AddNewsForm({ onSubmit, onClose }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Policy");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Field label="Title"><input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Parking garage closed for repairs" /></Field>
      <Field label="Category">
        <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Policy</option><option>Supplies</option><option>Staff</option><option>Facilities</option>
        </select>
      </Field>
      <Field label="Short summary"><input style={inputStyle} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="One line for the feed preview" /></Field>
      <Field label="Full announcement">
        <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Full details staff will see when expanded" />
      </Field>
      <PrimaryBtn
        onClick={() => {
          if (!title.trim()) return;
          onSubmit({ title, category, excerpt: excerpt || title, body: body || excerpt || title, date: "Today" });
          onClose();
        }}
      >
        Publish announcement
      </PrimaryBtn>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                            */
/* ------------------------------------------------------------------ */
function DashboardView(props) {
  const { doctors, onToggleDoctor, onSelectDoctor, appts, onCycleAppt, onCancelAppt, onRemoveAppt,
    news, newsExpanded, setNewsExpanded, onDeleteNews, urgentCases, onSelectPatient, services,
    onCallNext, onToggleServiceStatus, query } = props;
  const available = doctors.filter((d) => d.status === "available").length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <VitalsTicker urgentCount={urgentCases.length} availableCount={available} totalDoctors={doctors.length} />
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <StatCard label="Patients today" value="142" delta="8%" deltaDir="up" icon={Users} tint={C.teal} />
        <StatCard label="Urgent cases" value={urgentCases.length} delta="2" deltaDir="up" icon={AlertTriangle} tint={C.urgent} />
        <StatCard label="Doctors available" value={`${available}/${doctors.length}`} icon={Stethoscope} tint={C.primary} />
        <StatCard label="Appointments today" value={appts.length} delta="3%" deltaDir="down" icon={CalendarDays} tint={C.amber} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(280px,1fr)", gap: 18 }} className="dash-grid">
        <UrgentCasesPanel cases={urgentCases} onSelect={onSelectPatient} query={query} />
        <DoctorAvailabilityPanel doctors={doctors} onToggle={onToggleDoctor} onSelect={onSelectDoctor} query={query} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(280px,1fr)", gap: 18 }} className="dash-grid">
        <AppointmentsPanel appts={appts} onCycleStatus={onCycleAppt} onCancel={onCancelAppt} onRemove={onRemoveAppt} query={query} />
        <NewsPanel news={news} expanded={newsExpanded} setExpanded={setNewsExpanded} onDelete={onDeleteNews} query={query} />
      </div>
      <ServicesStrip services={services} onCallNext={onCallNext} onToggleStatus={onToggleServiceStatus} query={query} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App shell                                                            */
/* ------------------------------------------------------------------ */
export default function ClinicDashboard() {
  const [view, setView] = useState("dashboard");
  const [doctors, setDoctors] = useState(SEED_DOCTORS);
  const [urgentCases, setUrgentCases] = useState(SEED_URGENT);
  const [roster, setRoster] = useState(SEED_ROSTER);
  const [appts, setAppts] = useState(SEED_APPTS);
  const [news, setNews] = useState(SEED_NEWS);
  const [services, setServices] = useState(SEED_SERVICES);

  const [newsExpanded, setNewsExpanded] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [query, setQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [modal, setModal] = useState(null); // 'patient' | 'doctor' | 'appointment' | 'news' | 'service'

  const { toasts, push } = useToasts();

  /* Doctors */
  const cycleOrder = { available: "busy", busy: "off", off: "available" };
  const toggleDoctor = (id) => setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, status: cycleOrder[d.status] } : d)));
  const addDoctor = (data) => {
    const doc = { id: uid("d"), status: "available", next: "Now", init: data.name.replace("Dr. ", "").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase(), color: C.teal, ...data };
    setDoctors((p) => [doc, ...p]);
    push(`${data.name} added to staff`);
  };
  const removeDoctor = (id) => {
    const d = doctors.find((x) => x.id === id);
    setDoctors((p) => p.filter((x) => x.id !== id));
    if (d) push(`${d.name} removed from staff list`);
  };

  /* Urgent / patients */
  const addPatient = ({ name, age, reason, severity, doctor, urgent }) => {
    if (urgent) {
      const p = { id: uid("p"), name, age, mrn: `MRN-${Math.floor(10000 + Math.random() * 89999)}`, reason, severity, doctor, wait: "0 min", vitals: { hr: 80, bp: "120/80", spo2: "98%" }, notes: "Newly admitted — awaiting full assessment." };
      setUrgentCases((prev) => [p, ...prev]);
    } else {
      setRoster((prev) => [{ id: uid("r"), mrn: `MRN-${Math.floor(10000 + Math.random() * 89999)}`, name, age, doctor, status: "Waiting", lastVisit: "Today" }, ...prev]);
    }
    push(`${name} added${urgent ? " to urgent cases" : " to roster"}`);
  };
  const assignDoctor = (id, doctorName) => {
    setUrgentCases((prev) => prev.map((p) => (p.id === id ? { ...p, doctor: doctorName } : p)));
    setSelectedPatient((sp) => (sp && sp.id === id ? { ...sp, doctor: doctorName } : sp));
  };
  const dischargeUrgent = (id) => {
    const p = urgentCases.find((x) => x.id === id);
    if (!p) return;
    setUrgentCases((prev) => prev.filter((x) => x.id !== id));
    setRoster((prev) => [{ id: uid("r"), mrn: p.mrn, name: p.name, age: p.age, doctor: p.doctor, status: "Discharged", lastVisit: "Today" }, ...prev]);
    push(`${p.name} discharged`);
  };
  const dischargeRoster = (id) => {
    setRoster((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Discharged" } : r)));
    push("Patient discharged");
  };
  const admitAsUrgent = (r) => {
    setUrgentCases((prev) => [{ id: uid("p"), name: r.name, age: r.age, mrn: r.mrn, reason: "Condition worsened — reassessment needed", severity: "high", doctor: r.doctor, wait: "0 min", vitals: { hr: 90, bp: "130/85", spo2: "97%" }, notes: "Escalated from general roster." }, ...prev]);
    setRoster((prev) => prev.filter((x) => x.id !== r.id));
    push(`${r.name} admitted as urgent`, "error");
  };

  /* Appointments */
  const apptCycle = { upcoming: "in-progress", "in-progress": "completed", completed: "upcoming" };
  const cycleAppt = (id) => setAppts((prev) => prev.map((a) => (a.id === id ? { ...a, status: apptCycle[a.status] || a.status } : a)));
  const cancelAppt = (id) => { setAppts((prev) => prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))); push("Appointment cancelled", "error"); };
  const removeAppt = (id) => { setAppts((prev) => prev.filter((a) => a.id !== id)); push("Appointment removed"); };
  const addAppt = (a) => { setAppts((prev) => [...prev, a]); push(`Appointment booked for ${a.patient}`); };

  /* Services */
  const callNext = (id) => setServices((prev) => prev.map((s) => (s.id === id ? { ...s, queue: Math.max(0, s.queue - 1) } : s)));
  const toggleServiceStatus = (id) => setServices((prev) => prev.map((s) => (s.id === id ? { ...s, status: s.status === "Open" ? "Closed" : "Open" } : s)));
  const addService = (data) => { setServices((p) => [{ id: uid("s"), icon: "Boxes", status: "Open", queue: 0, ...data }, ...p]); push(`${data.name} added to services`); };

  /* News */
  const addNews = (n) => { setNews((p) => [{ id: uid("n"), ...n }, ...p]); push("Announcement published"); };
  const deleteNews = (id) => { setNews((p) => p.filter((n) => n.id !== id)); push("Announcement removed"); };

  const today = useMemo(() => new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }), []);

  const viewMeta = {
    dashboard: { title: "Dashboard", subtitle: "Live overview across the clinic" },
    patients: { title: "Patients", subtitle: "Roster, admissions and discharges" },
    doctors: { title: "Doctors", subtitle: "Staff availability and workload" },
    appointments: { title: "Appointments", subtitle: "Book, update and cancel visits" },
    services: { title: "Services", subtitle: "Departments and queue status" },
    news: { title: "News", subtitle: "Post and manage announcements" },
  }[view];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif", color: C.ink }}>
      <style>{FONTS}</style>
      <style>{`
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        ::selection { background: ${C.tealSoft}; }
        @media (max-width: 880px) {
          .dash-grid { grid-template-columns: 1fr !important; }
          .sidebar { position: fixed !important; left: var(--sb-x, -260px); top: 0; bottom: 0; z-index: 40; transition: left .2s ease; }
          .menu-btn { display: flex !important; }
        }
        a, button:focus-visible, [tabindex]:focus-visible { outline: 2px solid ${C.teal}; outline-offset: 2px; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside className="sidebar" style={{ width: 232, flexShrink: 0, background: C.primary, padding: "22px 14px", display: "flex", flexDirection: "column", gap: 22, ["--sb-x"]: mobileNavOpen ? "0px" : "-260px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px" }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "#ffffff1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={18} color="#8FD9C9" />
            </div>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 15.5, color: "#fff" }}>Meridian Clinic</div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {NAV.map((n) => {
              const active = view === n.id;
              return (
                <button key={n.id} onClick={() => { setView(n.id); setMobileNavOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left", background: active ? "#ffffff14" : "transparent", color: active ? "#fff" : "#C9DDD9" }}>
                  <n.icon size={17} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5 }}>{n.label}</span>
                  {n.id === "patients" && <span style={{ marginLeft: "auto", background: C.urgent, color: "#fff", fontSize: 10.5, fontWeight: 700, borderRadius: 999, padding: "1px 6px" }}>{urgentCases.length}</span>}
                </button>
              );
            })}
          </nav>
          <div style={{ marginTop: "auto", padding: 14, background: "#ffffff0F", borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar initials="SB" color="#8FD9C9" size={36} />
              <div>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12.5, color: "#fff" }}>Dr. Sofia Bianchi</div>
                <div style={{ fontSize: 11, color: "#9FC2BB" }}>Internal Medicine</div>
              </div>
            </div>
          </div>
        </aside>

        {mobileNavOpen && <div onClick={() => setMobileNavOpen(false)} style={{ position: "fixed", inset: 0, background: "#0F272366", zIndex: 30 }} />}

        <main style={{ flex: 1, minWidth: 0, padding: "20px 26px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 22, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => setMobileNavOpen(true)} className="menu-btn" style={{ display: "none", border: `1px solid ${C.border}`, background: C.surface, borderRadius: 9, width: 36, height: 36, alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Menu size={17} />
              </button>
              <div>
                <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 21, margin: 0, color: C.ink }}>{viewMeta.title}</h1>
                <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>{viewMeta.subtitle} · {today}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <Search size={15} color={C.inkFaint} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patients, doctors…" style={{ border: `1px solid ${C.border}`, background: C.surface, borderRadius: 10, padding: "9px 12px 9px 32px", fontSize: 13, fontFamily: "Inter, sans-serif", width: 220, color: C.ink }} />
              </div>
              <button style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
                <Bell size={16} color={C.inkSoft} />
                <span style={{ position: "absolute", top: 6, right: 7, width: 6, height: 6, borderRadius: 999, background: C.urgent }} />
              </button>
              <Avatar initials="SB" color={C.primary} size={36} />
            </div>
          </div>

          {view === "dashboard" && (
            <DashboardView
              doctors={doctors} onToggleDoctor={toggleDoctor} onSelectDoctor={setSelectedDoctor}
              appts={appts} onCycleAppt={cycleAppt} onCancelAppt={cancelAppt} onRemoveAppt={removeAppt}
              news={news} newsExpanded={newsExpanded} setNewsExpanded={setNewsExpanded} onDeleteNews={deleteNews}
              urgentCases={urgentCases} onSelectPatient={setSelectedPatient}
              services={services} onCallNext={callNext} onToggleServiceStatus={toggleServiceStatus}
              query={query}
            />
          )}
          {view === "patients" && (
            <PatientsView
              urgentCases={urgentCases} roster={roster} doctors={doctors} query={query}
              onSelectPatient={setSelectedPatient} onNewPatient={() => setModal("patient")}
              onAdmit={admitAsUrgent} onDischargeRoster={dischargeRoster}
            />
          )}
          {view === "doctors" && (
            <DoctorsView doctors={doctors} onToggle={toggleDoctor} onSelect={setSelectedDoctor} query={query} onNew={() => setModal("doctor")} />
          )}
          {view === "appointments" && (
            <AppointmentsView appts={appts} onCycleStatus={cycleAppt} onCancel={cancelAppt} onRemove={removeAppt} query={query} onNew={() => setModal("appointment")} />
          )}
          {view === "services" && (
            <ServicesStrip services={services} onCallNext={callNext} onToggleStatus={toggleServiceStatus} query={query} onNew={() => setModal("service")} />
          )}
          {view === "news" && (
            <NewsPanel news={news} expanded={newsExpanded} setExpanded={setNewsExpanded} onDelete={deleteNews} query={query} onNew={() => setModal("news")} />
          )}
        </main>
      </div>

      <PatientDrawer patient={selectedPatient} onClose={() => setSelectedPatient(null)} doctors={doctors} onAssignDoctor={assignDoctor} onDischarge={dischargeUrgent} />
      <DoctorDrawer doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} onToggle={toggleDoctor} appts={appts} onRemove={removeDoctor} />

      {modal === "patient" && <Modal title="Add patient" onClose={() => setModal(null)}><AddPatientForm doctors={doctors} onSubmit={addPatient} onClose={() => setModal(null)} /></Modal>}
      {modal === "doctor" && <Modal title="Add doctor" onClose={() => setModal(null)}><AddDoctorForm onSubmit={addDoctor} onClose={() => setModal(null)} /></Modal>}
      {modal === "appointment" && <Modal title="New appointment" onClose={() => setModal(null)}><AddAppointmentForm doctors={doctors} onSubmit={addAppt} onClose={() => setModal(null)} /></Modal>}
      {modal === "service" && <Modal title="Add service" onClose={() => setModal(null)}><AddServiceForm onSubmit={addService} onClose={() => setModal(null)} /></Modal>}
      {modal === "news" && <Modal title="New announcement" onClose={() => setModal(null)} width={480}><AddNewsForm onSubmit={addNews} onClose={() => setModal(null)} /></Modal>}

      <ToastStack toasts={toasts} />
    </div>
  );
}
