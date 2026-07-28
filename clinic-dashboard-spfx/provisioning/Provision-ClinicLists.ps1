# provisioning/Provision-ClinicLists.ps1
# Run once against the target site by a site owner/admin.
# Requires: Install-Module PnP.PowerShell -Scope CurrentUser

param(
  [Parameter(Mandatory = $true)]
  [string]$SiteUrl = "https://7r4ptj.sharepoint.com/sites/CDPP"
)

Connect-PnPOnline -Url $SiteUrl -Interactive

function Ensure-List {
  param([string]$Title, [string]$Template = "GenericList")
  $list = Get-PnPList -Identity $Title -ErrorAction SilentlyContinue
  if (-not $list) {
    Write-Host "Creating list '$Title'..."
    New-PnPList -Title $Title -Template $Template -OnQuickLaunch:$false | Out-Null
  } else {
    Write-Host "List '$Title' already exists, skipping creation."
  }
}

function Ensure-Choice-Field {
  param([string]$ListTitle, [string]$InternalName, [string]$DisplayName, [string[]]$Choices, [string]$DefaultValue)
  $field = Get-PnPField -List $ListTitle -Identity $InternalName -ErrorAction SilentlyContinue
  if (-not $field) {
    Add-PnPField -List $ListTitle -InternalName $InternalName -DisplayName $DisplayName -Type Choice -Choices $Choices -AddToDefaultView | Out-Null
    if ($DefaultValue) {
      Set-PnPField -List $ListTitle -Identity $InternalName -Values @{ DefaultValue = $DefaultValue }
    }
  }
}

function Ensure-Text-Field {
  param([string]$ListTitle, [string]$InternalName, [string]$DisplayName, [switch]$MultiLine)
  $field = Get-PnPField -List $ListTitle -Identity $InternalName -ErrorAction SilentlyContinue
  if (-not $field) {
    $type = if ($MultiLine) { "Note" } else { "Text" }
    Add-PnPField -List $ListTitle -InternalName $InternalName -DisplayName $DisplayName -Type $type -AddToDefaultView | Out-Null
  }
}

function Ensure-Number-Field {
  param([string]$ListTitle, [string]$InternalName, [string]$DisplayName)
  $field = Get-PnPField -List $ListTitle -Identity $InternalName -ErrorAction SilentlyContinue
  if (-not $field) {
    Add-PnPField -List $ListTitle -InternalName $InternalName -DisplayName $DisplayName -Type Number -AddToDefaultView | Out-Null
  }
}

function Ensure-DateTime-Field {
  param([string]$ListTitle, [string]$InternalName, [string]$DisplayName)
  $field = Get-PnPField -List $ListTitle -Identity $InternalName -ErrorAction SilentlyContinue
  if (-not $field) {
    Add-PnPField -List $ListTitle -InternalName $InternalName -DisplayName $DisplayName -Type DateTime -AddToDefaultView | Out-Null
  }
}

function Ensure-Lookup-Field {
  param([string]$ListTitle, [string]$InternalName, [string]$DisplayName, [string]$LookupListTitle, [string]$LookupField = "Title")
  $field = Get-PnPField -List $ListTitle -Identity $InternalName -ErrorAction SilentlyContinue
  if (-not $field) {
    $lookupList = Get-PnPList -Identity $LookupListTitle
    Add-PnPFieldFromXml -List $ListTitle -FieldXml "<Field Type='Lookup' Name='$InternalName' StaticName='$InternalName' DisplayName='$DisplayName' List='{$($lookupList.Id)}' ShowField='$LookupField' />" | Out-Null
  }
}

function Ensure-Person-Field {
  param([string]$ListTitle, [string]$InternalName, [string]$DisplayName)
  $field = Get-PnPField -List $ListTitle -Identity $InternalName -ErrorAction SilentlyContinue
  if (-not $field) {
    Add-PnPFieldFromXml -List $ListTitle -FieldXml "<Field Type='User' Name='$InternalName' StaticName='$InternalName' DisplayName='$DisplayName' />" | Out-Null
  }
}

# --- 1. Doctors ---
Ensure-List -Title "Doctors"
Ensure-Text-Field -ListTitle "Doctors" -InternalName "Specialty" -DisplayName "Specialty"
Ensure-Text-Field -ListTitle "Doctors" -InternalName "Room" -DisplayName "Room"
Ensure-Choice-Field -ListTitle "Doctors" -InternalName "Status" -DisplayName "Status" -Choices @("Available", "Busy", "OffDuty") -DefaultValue "Available"

# --- 2. Patients ---
Ensure-List -Title "Patients"
Ensure-Text-Field -ListTitle "Patients" -InternalName "MRN" -DisplayName "MRN"
Ensure-Number-Field -ListTitle "Patients" -InternalName "Age" -DisplayName "Age"
Ensure-Choice-Field -ListTitle "Patients" -InternalName "Status" -DisplayName "Status" -Choices @("Waiting", "UrgentCritical", "UrgentHigh", "UrgentModerate", "UrgentLow", "Discharged") -DefaultValue "Waiting"
Ensure-Text-Field -ListTitle "Patients" -InternalName "ReasonForVisit" -DisplayName "Reason For Visit" -MultiLine
Ensure-Lookup-Field -ListTitle "Patients" -InternalName "AssignedDoctor" -DisplayName "Assigned Doctor" -LookupListTitle "Doctors"
Ensure-DateTime-Field -ListTitle "Patients" -InternalName "FlaggedAt" -DisplayName "Flagged At"
Ensure-Number-Field -ListTitle "Patients" -InternalName "HeartRate" -DisplayName "Heart Rate"
Ensure-Text-Field -ListTitle "Patients" -InternalName "BloodPressure" -DisplayName "Blood Pressure"
Ensure-Text-Field -ListTitle "Patients" -InternalName "SpO2" -DisplayName "SpO2"
Ensure-Text-Field -ListTitle "Patients" -InternalName "ClinicalNotes" -DisplayName "Clinical Notes" -MultiLine
Ensure-DateTime-Field -ListTitle "Patients" -InternalName "LastVisit" -DisplayName "Last Visit"

# --- 3. Appointments ---
Ensure-List -Title "Appointments"
Ensure-DateTime-Field -ListTitle "Appointments" -InternalName "ApptDateTime" -DisplayName "Appointment Date Time"
Ensure-Lookup-Field -ListTitle "Appointments" -InternalName "Doctor" -DisplayName "Doctor" -LookupListTitle "Doctors"
Ensure-Text-Field -ListTitle "Appointments" -InternalName "VisitType" -DisplayName "Visit Type"
Ensure-Text-Field -ListTitle "Appointments" -InternalName "Room" -DisplayName "Room"
Ensure-Choice-Field -ListTitle "Appointments" -InternalName "Status" -DisplayName "Status" -Choices @("Upcoming", "InProgress", "Completed", "Cancelled") -DefaultValue "Upcoming"

# --- 4. Services ---
Ensure-List -Title "Services"
Ensure-Text-Field -ListTitle "Services" -InternalName "Description" -DisplayName "Description"
Ensure-Choice-Field -ListTitle "Services" -InternalName "Icon" -DisplayName "Icon" -Choices @("Radiology", "Pharmacy", "Lab", "Emergency", "Physiotherapy", "Vaccination", "Other") -DefaultValue "Other"
Ensure-Choice-Field -ListTitle "Services" -InternalName "Status" -DisplayName "Status" -Choices @("Open", "Closed") -DefaultValue "Open"
Ensure-Number-Field -ListTitle "Services" -InternalName "Queue" -DisplayName "Queue"

# --- 5. News ---
Ensure-List -Title "News"
Ensure-Choice-Field -ListTitle "News" -InternalName "Category" -DisplayName "Category" -Choices @("Policy", "Supplies", "Staff", "Facilities") -DefaultValue "Policy"
Ensure-Text-Field -ListTitle "News" -InternalName "Excerpt" -DisplayName "Excerpt"
Ensure-Text-Field -ListTitle "News" -InternalName "Body" -DisplayName "Body" -MultiLine

# --- 6. StaffRoles ---
Ensure-List -Title "StaffRoles"
Ensure-Person-Field -ListTitle "StaffRoles" -InternalName "Person" -DisplayName "Person"
Ensure-Choice-Field -ListTitle "StaffRoles" -InternalName "Role" -DisplayName "Role" -Choices @("ChargeNurse", "Physician", "FrontDeskCoordinator", "DepartmentLead", "CommunicationsStaff", "ClinicalOperationsDirector") -DefaultValue "ChargeNurse"
Ensure-Lookup-Field -ListTitle "StaffRoles" -InternalName "Department" -DisplayName "Department" -LookupListTitle "Services"
Ensure-Lookup-Field -ListTitle "StaffRoles" -InternalName "Doctor" -DisplayName "Doctor" -LookupListTitle "Doctors"

# --- 7. AuditLog ---
Ensure-List -Title "AuditLog"
$auditActions = @(
  "PatientAdded", "PatientDischarged", "PatientAdmittedUrgent", "PhysicianReassigned",
  "AppointmentBooked", "AppointmentCancelled", "AppointmentStatusChanged",
  "DoctorStatusChanged", "DoctorAdded", "DoctorRemoved",
  "ServiceStatusChanged", "ServiceQueueCalled", "ServiceAdded",
  "NewsPublished", "NewsRemoved"
)
Ensure-Choice-Field -ListTitle "AuditLog" -InternalName "Action" -DisplayName "Action" -Choices $auditActions -DefaultValue "PatientAdded"
Ensure-Text-Field -ListTitle "AuditLog" -InternalName "TargetTitle" -DisplayName "Target Title"
Ensure-Text-Field -ListTitle "AuditLog" -InternalName "Details" -DisplayName "Details" -MultiLine

Write-Host "Seeding starter data (skips if Doctors list already has items)..."
$existingDoctors = Get-PnPListItem -List "Doctors" -PageSize 1
if ($existingDoctors.Count -eq 0) {
  Add-PnPListItem -List "Doctors" -Values @{ Title = "Dr. Amara Okafor"; Specialty = "Cardiology"; Room = "204"; Status = "Available" } | Out-Null
  Add-PnPListItem -List "Doctors" -Values @{ Title = "Dr. Liam Chen"; Specialty = "Emergency Medicine"; Room = "ER-2"; Status = "Busy" } | Out-Null
  Add-PnPListItem -List "Doctors" -Values @{ Title = "Dr. Priya Nair"; Specialty = "Pediatrics"; Room = "112"; Status = "Available" } | Out-Null
  Add-PnPListItem -List "Doctors" -Values @{ Title = "Dr. Marcus Reyes"; Specialty = "Orthopedics"; Room = "N/A"; Status = "OffDuty" } | Out-Null
  Add-PnPListItem -List "Doctors" -Values @{ Title = "Dr. Sofia Bianchi"; Specialty = "Internal Medicine"; Room = "108"; Status = "Available" } | Out-Null
  Add-PnPListItem -List "Doctors" -Values @{ Title = "Dr. Kwame Asante"; Specialty = "Neurology"; Room = "301"; Status = "Busy" } | Out-Null
  Add-PnPListItem -List "Doctors" -Values @{ Title = "Dr. Elena Petrova"; Specialty = "Dermatology"; Room = "116"; Status = "Available" } | Out-Null
  Add-PnPListItem -List "Doctors" -Values @{ Title = "Dr. Noah Bergstrom"; Specialty = "General Surgery"; Room = "OR-1"; Status = "Busy" } | Out-Null
}

$existingServices = Get-PnPListItem -List "Services" -PageSize 1
if ($existingServices.Count -eq 0) {
  Add-PnPListItem -List "Services" -Values @{ Title = "Radiology & Imaging"; Description = "X-ray, CT, MRI, ultrasound"; Icon = "Radiology"; Status = "Open"; Queue = 3 } | Out-Null
  Add-PnPListItem -List "Services" -Values @{ Title = "Pharmacy"; Description = "Prescriptions & refills"; Icon = "Pharmacy"; Status = "Open"; Queue = 6 } | Out-Null
  Add-PnPListItem -List "Services" -Values @{ Title = "Laboratory"; Description = "Blood work & diagnostics"; Icon = "Lab"; Status = "Open"; Queue = 4 } | Out-Null
  Add-PnPListItem -List "Services" -Values @{ Title = "Emergency Department"; Description = "Urgent & trauma care"; Icon = "Emergency"; Status = "Open"; Queue = 9 } | Out-Null
  Add-PnPListItem -List "Services" -Values @{ Title = "Physiotherapy"; Description = "Rehab & mobility care"; Icon = "Physiotherapy"; Status = "Open"; Queue = 1 } | Out-Null
  Add-PnPListItem -List "Services" -Values @{ Title = "Vaccination Clinic"; Description = "Immunizations"; Icon = "Vaccination"; Status = "Open"; Queue = 2 } | Out-Null
}

Write-Host "Provisioning complete."
