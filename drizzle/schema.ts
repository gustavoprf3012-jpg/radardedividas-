import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const diagnoses = mysqlTable("diagnoses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  incomeCents: int("incomeCents").notNull(),
  cashCents: int("cashCents").notNull(),
  availableCents: int("availableCents").notNull(),
  totalDebtCents: int("totalDebtCents").notNull(),
  topPriority: varchar("topPriority", { length: 160 }).notNull(),
  planJson: text("planJson").notNull(),
  completedPlanJson: text("completedPlanJson"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const diagnosisDebts = mysqlTable("diagnosisDebts", {
  id: int("id").autoincrement().primaryKey(),
  diagnosisId: int("diagnosisId").notNull().references(() => diagnoses.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 160 }).notNull(),
  balanceCents: int("balanceCents").notNull(),
  pressure: int("pressure").notNull(),
  dueDay: int("dueDay"),
  interestRateBps: int("interestRateBps"),
  minimumPaymentCents: int("minimumPaymentCents"),
  position: int("position").notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Diagnosis = typeof diagnoses.$inferSelect;
export type InsertDiagnosis = typeof diagnoses.$inferInsert;
export type DiagnosisDebt = typeof diagnosisDebts.$inferSelect;
export type InsertDiagnosisDebt = typeof diagnosisDebts.$inferInsert;
