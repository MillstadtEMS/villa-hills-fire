/**
 * Membership Applications database — Neon Postgres (serverless).
 * Store and manage volunteer firefighter applications.
 */

import { neon } from "@neondatabase/serverless";

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  return neon(url);
}

// -- Types --

export interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dob: string;
  basicOpsClass: string;
  mondayTraining: string;
  militaryService: string;
  militaryBranch?: string;
  dischargeStatus?: string;
  dd214?: string;
  medicalLicense: string;
  medicalLicenseType?: string;
  medicalLicenseNumber?: string;
  medicalLicenseExpiration?: string;
  medicalDisclaimer: string;
  convictedMisdemeanor: string;
  misdemeanorExplanation?: string;
  convictedFelony: string;
  felonyExplanation?: string;
  moralTurpitude: string;
  moralTurpitudeExplanation?: string;
  signature: string;
  signatureDate: string;
  status: "pending" | "approved" | "denied" | "waitlisted";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  applicationId: string;
  item: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// -- Schema --

async function ensureSchema() {
  const db = sql();
  await db`
    CREATE TABLE IF NOT EXISTS applications (
      id                        TEXT PRIMARY KEY,
      first_name                TEXT NOT NULL,
      last_name                 TEXT NOT NULL,
      email                     TEXT NOT NULL,
      phone                     TEXT NOT NULL,
      address                   TEXT NOT NULL,
      city                      TEXT NOT NULL,
      state                     TEXT NOT NULL,
      zip                       TEXT NOT NULL,
      dob                       TEXT NOT NULL,
      basic_ops_class           TEXT NOT NULL,
      monday_training           TEXT NOT NULL,
      military_service          TEXT NOT NULL,
      military_branch           TEXT,
      discharge_status          TEXT,
      dd214                     TEXT,
      medical_license           TEXT NOT NULL,
      medical_license_type      TEXT,
      medical_license_number    TEXT,
      medical_license_expiration TEXT,
      medical_disclaimer        TEXT NOT NULL,
      convicted_misdemeanor     TEXT NOT NULL,
      misdemeanor_explanation   TEXT,
      convicted_felony          TEXT NOT NULL,
      felony_explanation        TEXT,
      moral_turpitude           TEXT NOT NULL,
      moral_turpitude_explanation TEXT,
      signature                 TEXT NOT NULL,
      signature_date            TEXT NOT NULL,
      status                    TEXT NOT NULL DEFAULT 'pending',
      notes                     TEXT,
      created_at                TIMESTAMPTZ DEFAULT NOW(),
      updated_at                TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await db`
    CREATE TABLE IF NOT EXISTS application_checklist (
      id             TEXT PRIMARY KEY,
      application_id TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      item           TEXT NOT NULL,
      completed      BOOLEAN NOT NULL DEFAULT FALSE,
      created_at     TIMESTAMPTZ DEFAULT NOW(),
      updated_at     TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

// -- Helpers --

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function rowToApplication(row: Record<string, unknown>): Application {
  return {
    id: String(row.id),
    firstName: String(row.first_name),
    lastName: String(row.last_name),
    email: String(row.email),
    phone: String(row.phone),
    address: String(row.address),
    city: String(row.city),
    state: String(row.state),
    zip: String(row.zip),
    dob: String(row.dob),
    basicOpsClass: String(row.basic_ops_class),
    mondayTraining: String(row.monday_training),
    militaryService: String(row.military_service),
    militaryBranch: row.military_branch ? String(row.military_branch) : undefined,
    dischargeStatus: row.discharge_status ? String(row.discharge_status) : undefined,
    dd214: row.dd214 ? String(row.dd214) : undefined,
    medicalLicense: String(row.medical_license),
    medicalLicenseType: row.medical_license_type ? String(row.medical_license_type) : undefined,
    medicalLicenseNumber: row.medical_license_number ? String(row.medical_license_number) : undefined,
    medicalLicenseExpiration: row.medical_license_expiration ? String(row.medical_license_expiration) : undefined,
    medicalDisclaimer: String(row.medical_disclaimer),
    convictedMisdemeanor: String(row.convicted_misdemeanor),
    misdemeanorExplanation: row.misdemeanor_explanation ? String(row.misdemeanor_explanation) : undefined,
    convictedFelony: String(row.convicted_felony),
    felonyExplanation: row.felony_explanation ? String(row.felony_explanation) : undefined,
    moralTurpitude: String(row.moral_turpitude),
    moralTurpitudeExplanation: row.moral_turpitude_explanation ? String(row.moral_turpitude_explanation) : undefined,
    signature: String(row.signature),
    signatureDate: String(row.signature_date),
    status: String(row.status) as "pending" | "approved" | "denied" | "waitlisted",
    notes: row.notes ? String(row.notes) : undefined,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  };
}

function rowToChecklistItem(row: Record<string, unknown>): ChecklistItem {
  return {
    id: String(row.id),
    applicationId: String(row.application_id),
    item: String(row.item),
    completed: Boolean(row.completed),
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  };
}

// -- Public API --

export async function saveApplication(data: Record<string, string>): Promise<Application> {
  await ensureSchema();
  const db = sql();

  const id = uid();
  const application: Application = {
    id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    city: data.city,
    state: data.state,
    zip: data.zip,
    dob: data.dob,
    basicOpsClass: data.basicOpsClass,
    mondayTraining: data.mondayTraining,
    militaryService: data.militaryService,
    militaryBranch: data.militaryBranch,
    dischargeStatus: data.dischargeStatus,
    dd214: data.dd214,
    medicalLicense: data.medicalLicense,
    medicalLicenseType: data.medicalLicenseType,
    medicalLicenseNumber: data.medicalLicenseNumber,
    medicalLicenseExpiration: data.medicalLicenseExpiration,
    medicalDisclaimer: data.medicalDisclaimer,
    convictedMisdemeanor: data.convictedMisdemeanor,
    misdemeanorExplanation: data.misdemeanorExplanation,
    convictedFelony: data.convictedFelony,
    felonyExplanation: data.felonyExplanation,
    moralTurpitude: data.moralTurpitude,
    moralTurpitudeExplanation: data.moralTurpitudeExplanation,
    signature: data.signature,
    signatureDate: data.signatureDate || new Date().toISOString(),
    status: "pending" as const,
    notes: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db`
    INSERT INTO applications (
      id, first_name, last_name, email, phone, address, city, state, zip, dob,
      basic_ops_class, monday_training, military_service, military_branch, discharge_status, dd214,
      medical_license, medical_license_type, medical_license_number, medical_license_expiration, medical_disclaimer,
      convicted_misdemeanor, misdemeanor_explanation, convicted_felony, felony_explanation,
      moral_turpitude, moral_turpitude_explanation, signature, signature_date, status
    ) VALUES (
      ${id}, ${application.firstName}, ${application.lastName}, ${application.email}, ${application.phone},
      ${application.address}, ${application.city}, ${application.state}, ${application.zip}, ${application.dob},
      ${application.basicOpsClass}, ${application.mondayTraining}, ${application.militaryService}, ${application.militaryBranch},
      ${application.dischargeStatus}, ${application.dd214}, ${application.medicalLicense}, ${application.medicalLicenseType},
      ${application.medicalLicenseNumber}, ${application.medicalLicenseExpiration}, ${application.medicalDisclaimer},
      ${application.convictedMisdemeanor}, ${application.misdemeanorExplanation}, ${application.convictedFelony},
      ${application.felonyExplanation}, ${application.moralTurpitude}, ${application.moralTurpitudeExplanation},
      ${application.signature}, ${application.signatureDate}, ${application.status}
    )
  `;

  return application;
}

export async function getApplications(): Promise<Application[]> {
  await ensureSchema();
  const db = sql();
  const rows = await db`SELECT * FROM applications ORDER BY created_at DESC`;
  return (rows as Record<string, unknown>[]).map(rowToApplication);
}

export async function getApplication(id: string): Promise<Application | null> {
  await ensureSchema();
  const db = sql();
  const rows = await db`SELECT * FROM applications WHERE id = ${id} LIMIT 1`;
  if (rows.length === 0) return null;
  return rowToApplication(rows[0] as Record<string, unknown>);
}

export async function updateApplicationStatus(id: string, status: "pending" | "approved" | "denied" | "waitlisted", notes?: string): Promise<void> {
  await ensureSchema();
  const db = sql();
  await db`
    UPDATE applications
    SET status = ${status}, notes = ${notes}, updated_at = NOW()
    WHERE id = ${id}
  `;
}

export async function getChecklistItems(applicationId: string): Promise<ChecklistItem[]> {
  await ensureSchema();
  const db = sql();
  const rows = await db`SELECT * FROM application_checklist WHERE application_id = ${applicationId} ORDER BY created_at ASC`;
  return (rows as Record<string, unknown>[]).map(rowToChecklistItem);
}

export async function addChecklistItem(applicationId: string, item: string): Promise<ChecklistItem> {
  await ensureSchema();
  const db = sql();
  const id = uid();
  await db`
    INSERT INTO application_checklist (id, application_id, item)
    VALUES (${id}, ${applicationId}, ${item})
  `;
  return {
    id,
    applicationId,
    item,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function updateChecklistItem(id: string, completed: boolean): Promise<void> {
  await ensureSchema();
  const db = sql();
  await db`
    UPDATE application_checklist
    SET completed = ${completed}, updated_at = NOW()
    WHERE id = ${id}
  `;
}

export async function deleteChecklistItem(id: string): Promise<void> {
  await ensureSchema();
  const db = sql();
  await db`DELETE FROM application_checklist WHERE id = ${id}`;
}