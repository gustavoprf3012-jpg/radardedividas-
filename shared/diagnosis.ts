export type DebtInput = {
  label: string;
  balanceCents: number;
  pressure: number;
};

export type RankedDebt = DebtInput & {
  position: number;
};

export function calculateAvailableCents(incomeCents: number, cashCents: number) {
  return Math.max(cashCents - Math.round(incomeCents * 0.08), 0);
}

export function calculateTotalDebtCents(debts: DebtInput[]) {
  return debts.reduce((total, debt) => total + Math.max(debt.balanceCents, 0), 0);
}

export function rankDebts(debts: DebtInput[]): RankedDebt[] {
  return [...debts]
    .map((debt) => ({ ...debt }))
    .sort((a, b) => b.pressure - a.pressure)
    .map((debt, index) => ({ ...debt, position: index + 1 }));
}
