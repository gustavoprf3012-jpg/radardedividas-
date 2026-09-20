import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createDiagnosis, getDiagnosisForUser, getDiagnosesForUser } from "./db";

const debtInput = z.object({
  label: z.string().trim().min(2).max(160),
  balanceCents: z.number().int().min(0).max(2_000_000_000),
  pressure: z.number().int().min(0).max(100),
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
    byId: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(({ ctx, input }) => getDiagnosisForUser(ctx.user.id, input.id)),
    create: protectedProcedure
      .input(
        z.object({
          incomeCents: z.number().int().min(0).max(2_000_000_000),
          cashCents: z.number().int().min(0).max(2_000_000_000),
          availableCents: z.number().int().min(0).max(2_000_000_000),
          totalDebtCents: z.number().int().min(0).max(2_000_000_000),
          topPriority: z.string().trim().min(2).max(160),
          planJson: z.string().max(20_000),
          debts: z.array(debtInput).min(1).max(12),
        }),
      )
      .mutation(({ ctx, input }) =>
        createDiagnosis({
          diagnosis: {
            userId: ctx.user.id,
            incomeCents: input.incomeCents,
            cashCents: input.cashCents,
            availableCents: input.availableCents,
            totalDebtCents: input.totalDebtCents,
            topPriority: input.topPriority,
            planJson: input.planJson,
          },
          debts: input.debts.map((debt) => ({
            diagnosisId: 0,
            label: debt.label,
            balanceCents: debt.balanceCents,
            pressure: debt.pressure,
            position: debt.position,
          })),
        }),
      ),
  }),
});

export type AppRouter = typeof appRouter;
