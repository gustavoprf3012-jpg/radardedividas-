import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createDiagnosis, getDiagnosisForUser, getDiagnosesForUser, updateDiagnosisProgress } from "./db";

const debtInput = z.object({
  label: z.string().trim().min(2).max(160),
  balanceCents: z.number().int().min(0).max(2_000_000_000),
  pressure: z.number().int().min(0).max(100),
  dueDay: z.number().int().min(1).max(31).nullable().optional(),
  interestRateBps: z.number().int().min(0).max(10_000_000).nullable().optional(),
  minimumPaymentCents: z.number().int().min(0).max(2_000_000_000).nullable().optional(),
  position: z.number().int().min(1).max(12),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  diagnosis: router({
    list: protectedProcedure.query(({ ctx }) => getDiagnosesForUser(ctx.user.id)),
    byId: protectedProcedure.input(z.object({ id: z.number().int().positive() })).query(({ ctx, input }) => getDiagnosisForUser(ctx.user.id, input.id)),
    create: protectedProcedure.input(z.object({
      incomeCents: z.number().int().min(0).max(2_000_000_000),
      cashCents: z.number().int().min(0).max(2_000_000_000),
      availableCents: z.number().int().min(0).max(2_000_000_000),
      totalDebtCents: z.number().int().min(0).max(2_000_000_000),
      topPriority: z.string().trim().min(2).max(160),
      planJson: z.string().max(20_000),
      debts: z.array(debtInput).min(1).max(12),
    })).mutation(({ ctx, input }) => createDiagnosis({
      diagnosis: { userId: ctx.user.id, incomeCents: input.incomeCents, cashCents: input.cashCents, availableCents: input.availableCents, totalDebtCents: input.totalDebtCents, topPriority: input.topPriority, planJson: input.planJson, completedPlanJson: "[]" },
      debts: input.debts.map((debt) => ({ diagnosisId: 0, label: debt.label, balanceCents: debt.balanceCents, pressure: debt.pressure, dueDay: debt.dueDay ?? null, interestRateBps: debt.interestRateBps ?? null, minimumPaymentCents: debt.minimumPaymentCents ?? null, position: debt.position })),
    })),
    updateProgress: protectedProcedure.input(z.object({ diagnosisId: z.number().int().positive(), completed: z.array(z.number().int().min(0).max(20)).max(20) })).mutation(({ ctx, input }) => updateDiagnosisProgress(ctx.user.id, input.diagnosisId, JSON.stringify(input.completed))),
  }),
});

export type AppRouter = typeof appRouter;
