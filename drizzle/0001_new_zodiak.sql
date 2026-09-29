ALTER TABLE `diagnoses` ADD COLUMN `completedPlanJson` text NULL;--> statement-breakpoint
ALTER TABLE `diagnosisDebts` ADD COLUMN `dueDay` int NULL;--> statement-breakpoint
ALTER TABLE `diagnosisDebts` ADD COLUMN `interestRateBps` int NULL;--> statement-breakpoint
ALTER TABLE `diagnosisDebts` ADD COLUMN `minimumPaymentCents` int NULL;
