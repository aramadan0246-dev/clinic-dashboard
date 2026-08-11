# Clinic Dashboard Patient Portal (SPFx)

## Summary

A single-page operations dashboard for clinic staff, built as a SharePoint Framework web part. It gives Charge Nurses, Physicians, Front Desk Coordinators, Department Leads, and Communications staff one real-time view of urgent patient cases, doctor availability, appointments, department service queues, and clinic announcements — all backed by native SharePoint Lists instead of a separate database.

Re-platformed from a standalone React prototype into a production-shaped SPFx solution: same visual design and interaction patterns, now wired to real data with role-based action gating and a full audit trail.

## Features

- **Dashboard** — live ward-pulse ticker, stat cards (patients, urgent cases, doctor availability, appointments), and a unified overview of every module.
- **Patients** — unified roster spanning Waiting → Urgent (4 severities) → Discharged, with admission, discharge, and physician reassignment.
- **Doctors** — availability status (Available / Busy / Off duty), computed next-appointment slot, add/remove staff.
- **Appointments** — book, progress through status, cancel, and filter by state.
- **Services** — department queues with open/closed toggling and "call next".
- **News** — clinic-wide announcements by category.
- **Role-based access** — every write action is gated by the signed-in user's role (looked up from a `StaffRoles` list), with a full-admin role and department/physician-scoped permissions for the rest. Gating is UI-level; real enforcement stays at SharePoint list permissions.
- **Audit trail** — every write action is logged to an `AuditLog` list with the acting user and timestamp.
- **Global search** — filters patients, doctors, appointments, services, and news simultaneously.

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.23.2-green.svg)

## Tech stack

- SharePoint Framework 1.23.2 (Heft build toolchain)
- React 17 + TypeScript
- [PnPjs](https://pnp.github.io/pnpjs/) v4 for all SharePoint REST access
- [lucide-react](https://lucide.dev/) icons
- Jest + React Testing Library

## Data model

Seven SharePoint Lists, provisioned by [`provisioning/Provision-ClinicLists.ps1`](./provisioning/Provision-ClinicLists.ps1) (PnP.PowerShell): `Doctors`, `Patients`, `Appointments`, `Services`, `News`, `StaffRoles`, `AuditLog`.

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/sharepoint/dev/spfx/set-up-your-developer-tenant)

## Getting started

1. Install dependencies:
   ```powershell
   cd clinic-dashboard-spfx
   npm install
   ```
2. Provision the SharePoint Lists against your target site (requires `PnP.PowerShell`; a site owner/admin should run this):
   ```powershell
   cd provisioning
   .\Provision-ClinicLists.ps1 -SiteUrl "https://<your-tenant>.sharepoint.com/sites/<your-site>"
   ```
3. Build and package the web part:
   ```powershell
   npm run build
   ```
   This produces `sharepoint/solution/clinic-dashboard-spfx.sppkg`.
4. Upload the `.sppkg` to your site or tenant app catalog, add the **Clinic Dashboard Patient Portal** web part to a page, and add rows to the `StaffRoles` list to grant roles to your staff.

Run the test suite with:
```powershell
npx jest
```

## Role permissions

| Role | Access |
|---|---|
| ClinicalOperationsDirector | Full admin — every action |
| ChargeNurse | Patients, doctors, appointments, services (all) |
| Physician | Reassign/toggle status for their own patients only |
| FrontDeskCoordinator | Add patients, manage appointments |
| DepartmentLead | Manage their own department's service |
| CommunicationsStaff | Publish/remove news |
| *(no StaffRoles row)* | Read-only |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
