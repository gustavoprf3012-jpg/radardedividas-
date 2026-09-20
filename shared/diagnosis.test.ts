import { describe, expect, it } from "vitest";
import {
  calculateAvailableCents,
  calculateTotalDebtCents,
  rankDebts,
} from "./diagnosis";

describe("diagnosis rules", () => {
  it("reserves eight percent of income before calculating available cash", () => {
    expect(calculateAvailableCents(420000, 78000)).toBe(44400);
    expect(calculateAvailableCents(420000, 20000)).toBe(0);
  });

  it("ranks the highest-pressure debt first without changing balances", () => {
    const debts = [
      { label: "Empréstimo", balanceCents: 510000, pressure: 62 },
      { label: "Cartão", balanceCents: 247000, pressure: 86 },
      { label: "Conta atrasada", balanceCents: 86000, pressure: 43 },
    ];

    expect(rankDebts(debts)).toEqual([
      { label: "Cartão", balanceCents: 247000, pressure: 86, position: 1 },
      { label: "Empréstimo", balanceCents: 510000, pressure: 62, position: 2 },
      { label: "Conta atrasada", balanceCents: 86000, pressure: 43, position: 3 },
    ]);
    expect(debts[0]?.label).toBe("Empréstimo");
  });

  it("sums the total debt in cents", () => {
    expect(calculateTotalDebtCents([
      { label: "Cartão", balanceCents: 247000, pressure: 86 },
      { label: "Conta", balanceCents: 86000, pressure: 43 },
    ])).toBe(333000);
  });
});
