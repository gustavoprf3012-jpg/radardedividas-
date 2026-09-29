import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  diagnosisDebts,
  diagnoses,
  InsertDiagnosis,
  InsertDiagnosisDebt,
  InsertUser,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  textFields.forEach((field) => { if (user[field] !== undefined) { const normalized = user[field] ?? null; values[field] = normalized; updateSet[field] = normalized; } });
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export type NewDiagnosisRecord = { diagnosis: InsertDiagnosis; debts: InsertDiagnosisDebt[] };

export async function createDiagnosis(record: NewDiagnosisRecord) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const inserted = await db.insert(diagnoses).values(record.diagnosis);
  const diagnosisId = Number(inserted[0].insertId);
  if (!diagnosisId) throw new Error("Could not create diagnosis");
  if (record.debts.length > 0) await db.insert(diagnosisDebts).values(record.debts.map((debt) => ({ ...debt, diagnosisId })));
  return getDiagnosisForUser(record.diagnosis.userId, diagnosisId);
}

export async function getDiagnosisForUser(userId: number, diagnosisId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const diagnosis = await db.select().from(diagnoses).where(and(eq(diagnoses.id, diagnosisId), eq(diagnoses.userId, userId))).limit(1);
  if (!diagnosis[0]) return undefined;
  const debts = await db.select().from(diagnosisDebts).where(eq(diagnosisDebts.diagnosisId, diagnosisId));
  return { ...diagnosis[0], debts };
}

export async function getDiagnosesForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const records = await db.select().from(diagnoses).where(eq(diagnoses.userId, userId)).orderBy(desc(diagnoses.createdAt));
  return Promise.all(records.map((record) => getDiagnosisForUser(userId, record.id)));
}

export async function updateDiagnosisProgress(userId: number, diagnosisId: number, completedPlanJson: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(diagnoses).set({ completedPlanJson }).where(and(eq(diagnoses.id, diagnosisId), eq(diagnoses.userId, userId)));
  return getDiagnosisForUser(userId, diagnosisId);
}
