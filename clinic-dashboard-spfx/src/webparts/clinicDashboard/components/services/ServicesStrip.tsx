import * as React from "react";
import { Plus, Activity, Pill, FlaskConical, Ambulance, Dumbbell, Syringe, Boxes } from "lucide-react";
import { C, matches } from "../shared/tokens";
import { SectionHeader, PrimaryBtn, EmptyRow, Pill_ } from "../shared";
import { IService, ServiceIcon } from "../../data/models";
import { IPermissions } from "../../context/usePermissions";

export interface IServicesStripProps {
  services: IService[];
  onCallNext: (id: number) => void;
  onToggleStatus: (id: number) => void;
  query: string;
  onNew?: () => void;
  compact?: boolean;
  permissions: IPermissions;
}

type IconComponent = React.ComponentType<{ size?: number; color?: string }>;

const ICONS: Record<ServiceIcon, IconComponent> = {
  Radiology: Activity,
  Pharmacy: Pill,
  Lab: FlaskConical,
  Emergency: Ambulance,
  Physiotherapy: Dumbbell,
  Vaccination: Syringe,
  Other: Boxes,
};

export function ServicesStrip({ services, onCallNext, onToggleStatus, query, onNew, compact, permissions }: IServicesStripProps): JSX.Element {
  const filtered = services.filter((s) => matches(query, s.name, s.description));
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
      <SectionHeader
        title="Services"
        subtitle="Quick access to clinic departments"
        action={onNew && permissions.canAddService && <PrimaryBtn icon={Plus as React.ComponentType<{ size?: number }>} onClick={onNew}>Add service</PrimaryBtn>}
      />
      <div style={{ display: "grid", gridTemplateColumns: compact ? "repeat(auto-fit, minmax(140px, 1fr))" : "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
        {filtered.length === 0 && <EmptyRow text="No services match your search." />}
        {filtered.map((s) => {
          const Icon = ICONS[s.icon] || Boxes;
          const canManage = permissions.canManageService(s.id);
          return (
            <div key={s.id} style={{ display: "flex", flexDirection: "column", gap: 10, padding: 14, borderRadius: 12, border: `1px solid ${C.borderSoft}`, background: C.bg }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: C.tealSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={17} color={C.teal} />
                </div>
                <button
                  onClick={() => onToggleStatus(s.id)}
                  disabled={!canManage}
                  style={{ border: "none", background: "transparent", cursor: canManage ? "pointer" : "default" }}
                  title="Toggle open/closed"
                >
                  <Pill_ bg={s.status === "Open" ? C.greenSoft : C.surface2} fg={s.status === "Open" ? C.green : C.inkSoft}>{s.status}</Pill_>
                </button>
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: C.ink }}>{s.name}</div>
              <div style={{ fontSize: 11.5, color: C.inkSoft, fontFamily: "Inter, sans-serif" }}>{s.description}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                <span style={{ fontSize: 11, color: C.inkFaint, fontFamily: "IBM Plex Mono, monospace" }}>queue {s.queue}</span>
                <button
                  onClick={() => onCallNext(s.id)}
                  disabled={!canManage || s.queue === 0}
                  style={{ border: `1px solid ${C.border}`, background: C.surface, borderRadius: 999, padding: "4px 10px", fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: !canManage || s.queue === 0 ? C.inkFaint : C.inkSoft, cursor: !canManage || s.queue === 0 ? "default" : "pointer" }}
                >
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
