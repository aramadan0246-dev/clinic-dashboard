import * as React from "react";
import { Plus, Trash2, ChevronRight } from "lucide-react";
import { C, matches } from "../shared/tokens";
import { SectionHeader, PrimaryBtn, EmptyRow, Pill_, IconBtn } from "../shared";
import { INewsItem } from "../../data/models";
import { formatNewsDate } from "../../data/newsRepo";
import { IPermissions } from "../../context/usePermissions";

export interface INewsPanelProps {
  news: INewsItem[];
  expanded: number | null;
  setExpanded: (id: number | null) => void;
  onDelete: (id: number) => void;
  query: string;
  onNew?: () => void;
  permissions: IPermissions;
}

export function NewsPanel({ news, expanded, setExpanded, onDelete, query, onNew, permissions }: INewsPanelProps): JSX.Element {
  const filtered = news.filter((n) => matches(query, n.title, n.category, n.excerpt));
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
      <SectionHeader
        title="Clinic news"
        subtitle="Announcements & updates"
        action={onNew && permissions.canManageNews && <PrimaryBtn icon={Plus as React.ComponentType<{ size?: number }>} onClick={onNew}>New announcement</PrimaryBtn>}
      />
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
                      <span style={{ fontSize: 11, color: C.inkFaint, fontFamily: "IBM Plex Mono, monospace" }}>{formatNewsDate(n.createdDate)}</span>
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: C.ink }}>{n.title}</div>
                    {!isOpen && <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 3, fontFamily: "Inter, sans-serif" }}>{n.excerpt}</div>}
                  </div>
                  <ChevronRight size={15} color={C.inkFaint} style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .15s", flexShrink: 0, marginTop: 3 }} />
                </button>
                {permissions.canManageNews && <IconBtn icon={Trash2 as React.ComponentType<{ size?: number }>} tone="danger" title="Delete announcement" onClick={() => onDelete(n.id)} />}
              </div>
              {isOpen && <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 8, lineHeight: 1.5, fontFamily: "Inter, sans-serif" }}>{n.body}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
