export type DebtInput = {
  label: string;
  balanceCents: number;
  pressure: number;
  dueDay?: number | null;
  interestRateBps?: number | null;
  minimumPaymentCents?: number | null;
};

export type RankedDebt = DebtInput & { position: number; priorityScore: number };

export function calculateAvailableCents(incomeCents: number, cashCents: number) {
  return Math.max(cashCents - Math.round(incomeCents * 0.08), 0);
}

export function calculateTotalDebtCents(debts: DebtInput[]) {
  return debts.reduce((total, debt) => total + Math.max(debt.balanceCents, 0), 0);
}

function dueUrgency(dueDay?: number | null) {
  if (!dueDay) return 0;
  const day = new Date().getDate();
  const daysUntil = dueDay >= day ? dueDay - day : 30 - day + dueDay;
  return daysUntil <= 3 ? 18 : daysUntil <= 7 ? 10 : 0;
}

export function rankDebts(debts: DebtInput[]): RankedDebt[] {
  return [...debts]
    .map((debt) => ({
      ...debt,
      priorityScore: Math.round(debt.pressure * 1.5 + Math.min((debt.interestRateBps ?? 0) / 100, 20) + dueUrgency(debt.dueDay)),
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore || b.pressure - a.pressure)
    .map((debt, index) => ({ ...debt, position: index + 1 }));
}
