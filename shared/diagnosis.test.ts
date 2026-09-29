import { describe, expect, it } from "vitest";
import { calculateAvailableCents, calculateTotalDebtCents, rankDebts } from "./diagnosis";

describe("diagnosis rules", () => {
  it("reserves eight percent of income before calculating available cash", () => {
    expect(calculateAvailableCents(420000, 78000)).toBe(44400);
    expect(calculateAvailableCents(420000, 20000)).toBe(0);
  });

  it("ranks the highest-pressure debt first and exposes its score", () => {
    const debts = [
      { label: "Empréstimo", balanceCents: 510000, pressure: 62 },
      { label: "Cartão", balanceCents: 247000, pressure: 86 },
      { label: "Conta atrasada", balanceCents: 86000, pressure: 43 },
    ];
    const ranked = rankDebts(debts);
    expect(ranked[0]).toMatchObject({ label: "Cartão", pressure: 86, position: 1, priorityScore: 129 });
    expect(ranked[1]).toMatchObject({ label: "Empréstimo", pressure: 62, position: 2 });
    expect(debts[0]?.label).toBe("Empréstimo");
  });

  it("raises a debt with a near due date and interest above equal pressure", () => {
    const ranked = rankDebts([
      { label: "Sem urgência", balanceCents: 100000, pressure: 80 },
      { label: "Vence logo", balanceCents: 100000, pressure: 70, dueDay: new Date().getDate(), interestRateBps: 1200 },
    ]);
    expect(ranked[0]?.label).toBe("Vence logo");
  });

  it("sums the total debt in cents", () => {
    expect(calculateTotalDebtCents([{ label: "Cartão", balanceCents: 247000, pressure: 86 }, { label: "Conta", balanceCents: 86000, pressure: 43 }])).toBe(333000);
  });
});
