# Clinic Dashboard Patient Portal — SPFx Design

Status: Approved (pending final spec review)
Date: 2026-07-27
Source inputs: `BRD_Clinic_Dashboard_Patient_Portal.pdf` (v1.0, Draft for Review) and `clinic-dashboard.jsx` (React prototype)
Target site: `https://7r4ptj.sharepoint.com/sites/CDPP` (page: `SitePages/CollabHome.aspx`)

## 1. Overview

Re-platform the existing React prototype (`clinic-dashboard.jsx`) into a production-shaped SPFx web part that fulfills the BRD's functional requirements in full (Must + Should + Could), backed by real SharePoint Lists instead of in-memory seed data. This is a re-platform, not a redesign — the visual design, component boundaries, and interaction patterns of the prototype carry over unchanged; what changes is the data layer (SharePoint Lists via PnPjs), the packaging (SPFx web part instead of a standalone React app), and the addition of role-based action gating and an audit trail.

Deployment and app-catalog steps are the user's own responsibility; this spec and its implementation plan stop at producing a working `.sppkg` and a provisioning script.

## 2. Decisions made during brainstorming

| Topic | Decision |
|---|---|
| Data source | Real SharePoint Lists (not just in-memory mock data) |
| List provisioning | PnP.PowerShell script in-repo, run once by an admin against the target site |
| Web part structure | One SPFx web part with internal client-side nav (matches BRD wording: "a SharePoint-embedded web part") |
| Functional scope | Full BRD: all Must + Should + Could requirements (sections 6.1–6.7) |
| Role-based access | Custom `StaffRoles` SharePoint list (not AD/SP groups); soft UI gating (hide/disable actions), not a hard security boundary — real enforcement stays at SharePoint list-permission level, consistent with NFR-03's "later phase" note |
| Patients data model | One `Patients` list with a `Status` field spanning Waiting → Urgent (4 severities) → Discharged, rather than two separate lists, since the BRD's own FR-PAT-06 treats "admit as urgent" as a status escalation on the same patient |
| Audit trail | Implemented now via a dedicated `AuditLog` list + SharePoint's built-in Created/Author fields, even though NFR-07 is "Should"/"future release" — justified because we're already on real SharePoint identity, so it's nearly free |
| Target environment | `https://7r4ptj.sharepoint.com/sites/CDPP` |
| App catalog / deployment | User will deploy the `.sppkg` themselves; out of scope for the build |
| Node tooling | Machine has Node v26.5 globally (incompatible with SPFx's gulp/webpack toolchain, which needs 18/20 LTS) — install nvm-windows and use Node 20 LTS for this project only |

## 3. Project structure

```
clinic-dashboard-spfx/
├── config/                        # SPFx standard config (serve, package-solution, etc.)
├── sharepoint/assets/
├── provisioning/
│   └── Provision-ClinicLists.ps1  # PnP.PowerShell: creates all 7 lists, columns, seed data
├── src/webparts/clinicDashboard/
│   ├── ClinicDashboardWebPart.ts  # SPFx entry point, manifest, property pane
│   ├── components/
│   │   ├── ClinicDashboard.tsx    # shell: sidebar nav, top bar, search, view switch
│   │   ├── shared/                # Avatar, Pill_, StatCard, Modal, IconBtn, SectionHeader, EmptyRow, Field
│   │   ├── dashboard/             # DashboardView, VitalsTicker
│   │   ├── patients/              # PatientsView, UrgentCasesPanel, PatientDrawer, AddPatientForm
│   │   ├── doctors/               # DoctorsView, DoctorAvailabilityPanel, DoctorDrawer, AddDoctorForm
│   │   ├── appointments/          # AppointmentsView, AppointmentsPanel, AddAppointmentForm
│   │   ├── services/              # ServicesStrip, AddServiceForm
│   │   └── news/                  # NewsPanel, AddNewsForm
│   ├── data/
│   │   ├── models.ts              # Doctor, Patient, Appointment, Service, NewsItem, StaffRole, AuditEntry
│   │   ├── listNames.ts           # central SharePoint internal list-name constants
│   │   ├── doctorsRepo.ts
│   │   ├── patientsRepo.ts
│   │   ├── appointmentsRepo.ts
│   │   ├── servicesRepo.ts
│   │   ├── newsRepo.ts
│   │   ├── staffRolesRepo.ts
│   │   ├── auditRepo.ts
│   │   └── pnpConfig.ts           # sp.setup(...) bound to SPFx context
│   ├── context/
│   │   ├── ClinicDataProvider.tsx # fetch-all-on-load + CRUD actions + toasts + audit writes
│   │   └── useCurrentUserRole.ts  # StaffRoles lookup -> { role, department, doctorId }
│   └── loc/                       # SPFx localization strings
└── package.json
```

Every feature component (`DashboardView`, `PatientsView`, `DoctorsView`, `AppointmentsView`, `ServicesStrip`, `NewsPanel`, and their drawers/forms) keeps the same props shape, JSX structure, and inline-style design tokens (`C` palette, `FONTS`) as the current prototype. The only structural change is that data comes from `useClinicData()` (reading `ClinicDataProvider`'s context) instead of the top-level component's local `useState` seed arrays, and role-derived booleans from `usePermissions()` gate which optional action props (`onNew`, `onDelete`, etc.) get passed down.

## 4. SharePoint Lists (data model)

Internal (API) names are PascalCase, no spaces. All lists live in the target site.

### 4.1 `Doctors`
| Column | Type | Notes |
|---|---|---|
| Title | Single line text | Full name, e.g. "Dr. Amara Okafor" |
| Specialty | Single line text | |
| Room | Single line text | |
| Status | Choice: `Available` / `Busy` / `OffDuty` | |

Derived, not stored: initials/avatar color (computed client-side from name); "next slot" (computed by querying `Appointments` for this doctor's next non-cancelled appointment ≥ now — avoids the data-accuracy drift the BRD's own Risks section (9) calls out).

### 4.2 `Patients`
| Column | Type | Notes |
|---|---|---|
| Title | Single line text | Patient name |
| MRN | Single line text | Client-generated on create, e.g. `MRN-88214` |
| Age | Number | |
| Status | Choice: `Waiting` / `UrgentCritical` / `UrgentHigh` / `UrgentModerate` / `UrgentLow` / `Discharged` | Urgent queue = a filtered view of this list, not a separate list |
| ReasonForVisit | Multi-line plain text | |
| AssignedDoctor | Lookup → Doctors | |
| FlaggedAt | Date/Time | Set when patient enters Waiting or is escalated to Urgent; wait time is computed live as `now − FlaggedAt` |
| HeartRate | Number | Optional vitals |
| BloodPressure | Single line text | Optional vitals |
| SpO2 | Single line text | Optional vitals |
| ClinicalNotes | Multi-line text | |
| LastVisit | Date/Time | |

### 4.3 `Appointments`
| Column | Type | Notes |
|---|---|---|
| Title | Single line text | Patient name (free text — matches prototype's `AddAppointmentForm`, which doesn't require an existing Patients record) |
| ApptDateTime | Date/Time | |
| Doctor | Lookup → Doctors | |
| VisitType | Single line text | |
| Room | Single line text | |
| Status | Choice: `Upcoming` / `InProgress` / `Completed` / `Cancelled` | |

### 4.4 `Services`
| Column | Type | Notes |
|---|---|---|
| Title | Single line text | |
| Description | Single line text | |
| Icon | Choice: `Radiology` / `Pharmacy` / `Lab` / `Emergency` / `Physiotherapy` / `Vaccination` / `Other` | Maps to a fixed lucide-icon lookup client-side |
| Status | Choice: `Open` / `Closed` | |
| Queue | Number | |

### 4.5 `News`
| Column | Type | Notes |
|---|---|---|
| Title | Single line text | Headline |
| Category | Choice: `Policy` / `Supplies` / `Staff` / `Facilities` | |
| Excerpt | Single line text | Feed preview |
| Body | Multi-line enhanced rich text | Full announcement |

(`Created`/`Author` built-ins cover date/publisher.)

### 4.6 `StaffRoles`
| Column | Type | Notes |
|---|---|---|
| Person | Person field | |
| Role | Choice: `ChargeNurse` / `Physician` / `FrontDeskCoordinator` / `DepartmentLead` / `CommunicationsStaff` / `ClinicalOperationsDirector` | |
| Department | Lookup → Services | Meaningful only for `DepartmentLead` |
| Doctor | Lookup → Doctors | Meaningful only for `Physician` |

### 4.7 `AuditLog`
| Column | Type | Notes |
|---|---|---|
| Title | Single line text | Short label, e.g. "Discharge: Harold Whitfield" |
| Action | Choice: `PatientAdded`, `PatientDischarged`, `PatientAdmittedUrgent`, `PhysicianReassigned`, `AppointmentBooked`, `AppointmentCancelled`, `AppointmentStatusChanged`, `DoctorStatusChanged`, `DoctorAdded`, `DoctorRemoved`, `ServiceStatusChanged`, `ServiceQueueCalled`, `ServiceAdded`, `NewsPublished`, `NewsRemoved` | |
| TargetTitle | Single line text | Human-readable reference to what changed |
| Details | Multi-line text | Optional extra context |

(`Created` + `Author` built-ins give timestamp + acting user — the actual attribution NFR-07 requires.)

## 5. Component architecture & data flow

```
ClinicDashboard.tsx
  <ClinicDataProvider>            // parallel fetch of all 7 lists on mount via sp.batch()
    <RoleProvider>                // useCurrentUserRole: StaffRoles lookup for current user
      {view === "dashboard"}  -> <DashboardView .../>
      {view === "patients"}   -> <PatientsView .../>
      {view === "doctors"}    -> <DoctorsView .../>
      {view === "appointments"} -> <AppointmentsView .../>
      {view === "services"}   -> <ServicesStrip .../>
      {view === "news"}       -> <NewsPanel .../>
```

`ClinicDataProvider` exposes the same shape of state and action functions the prototype's top-level component already has (`doctors`, `urgentCases`, `roster`, `appts`, `news`, `services`, plus `addPatient`, `dischargeUrgent`, `admitAsUrgent`, `cycleAppt`, `cancelAppt`, `toggleDoctor`, `callNext`, etc.) — except each action now performs a PnPjs write, optimistically updates local state, and (where applicable) writes an `AuditLog` entry, before falling back to the existing toast system on failure.

## 6. Role-based access (soft UI gating)

`StaffRoles` lookup → `usePermissions()` hook → capability booleans consumed by feature components to decide whether to pass optional action props (`onNew`, `onDelete`, `onAssignDoctor`, etc.) at all. This is UI convenience, not a security boundary — SharePoint list permissions remain the actual enforcement layer, consistent with NFR-03's note that "row-level visibility may be refined per role in a later phase." Users with no matching `StaffRoles` record default to read-only (safe fallback; not explicitly specified in the BRD).

| Action | Charge Nurse | Physician | Front Desk Coord. | Dept. Lead | Comms Staff | Director |
|---|---|---|---|---|---|---|
| Add patient (roster/urgent) | ✅ | — | ✅ | — | — | — |
| Reassign physician | ✅ | ✅ (own cases only) | — | — | — | — |
| Discharge patient | ✅ | — | — | — | — | — |
| Admit roster → urgent | ✅ | — | — | — | — | — |
| Toggle doctor status | ✅ (any) | ✅ (own record only) | — | — | — | — |
| Add / remove doctor | ✅ | — | — | — | — | — |
| Book / cancel appointment | ✅ | — | ✅ | — | — | — |
| Appointment status progression | ✅ | — | ✅ | — | — | — |
| Call next / toggle open-closed | ✅ | — | — | ✅ (own dept. only) | — | — |
| Add service | ✅ | — | — | — | — | — |
| Publish / remove news | ✅ | — | — | — | ✅ | — |
| View everything | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

A Physician's scope is enforced via the `StaffRoles.Doctor` lookup (e.g. the doctor-status toggle only renders if `doctor.id === myDoctorId`); a Department Lead's scope via `StaffRoles.Department`.

## 7. Error handling & loading states

`ClinicDataProvider` exposes `status: "loading" | "ready" | "error"`. While `loading`, the web part shows a skeleton/spinner in place of the dashboard (targeting NFR-01's 2s render budget via one parallel `sp.batch()` fetch of all 7 lists). A retry banner appears if the initial load fails. Writes remain optimistic like the prototype today; a failed PnPjs write rolls back the local state change and surfaces the existing toast error path. `EmptyRow` empty-state behavior is unchanged.

## 8. Testing approach

Jest + React Testing Library covering the parts that carry actual logic: `usePermissions` resolution per role, derived values (live wait-time from `FlaggedAt`, computed doctor "next slot" from appointments), and status-transition logic (appointment/doctor status cycling). No e2e framework is introduced — manual UAT against the BRD's Section 10 KPI table (time-to-find-available-doctor, urgent-visibility lag, missed/duplicate appointments, staff awareness, user satisfaction) is the appropriate validation for a staff-facing tool at the BRD's stated "single-clinic scale."

## 9. Deployment sequencing (performed by the user)

1. Install nvm-windows; install and switch to Node 20 LTS for this project (global Node v26.5 elsewhere is untouched).
2. Scaffold the SPFx solution and build out `data/`, `context/`, `components/` per Section 3.
3. Run `provisioning/Provision-ClinicLists.ps1` against `https://7r4ptj.sharepoint.com/sites/CDPP` to create all 7 lists, columns, and starter seed data.
4. `gulp bundle --ship && gulp package-solution --ship` → produces the `.sppkg`.
5. User deploys the `.sppkg` to an app catalog and adds the web part to `SitePages/CollabHome.aspx` (or a new page) themselves.

## 10. Out of scope (per BRD Section 3.2, unchanged)

- Direct EHR integration.
- Native mobile apps.
- Billing/insurance/claims.
- E-prescribing beyond the pharmacy service tile.
- Patient-facing self-service.
- Real-time vitals device integration (vitals remain manually entered).
- Hard security-boundary enforcement of roles (soft UI gating only, per Section 6).
- Tenant/site app-catalog setup and actual `.sppkg` deployment (user-performed).
