CREATE TABLE `diagnoses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`incomeCents` int NOT NULL,
	`cashCents` int NOT NULL,
	`availableCents` int NOT NULL,
	`totalDebtCents` int NOT NULL,
	`topPriority` varchar(160) NOT NULL,
	`planJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `diagnoses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `diagnosisDebts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`diagnosisId` int NOT NULL,
	`label` varchar(160) NOT NULL,
	`balanceCents` int NOT NULL,
	`pressure` int NOT NULL,
	`position` int NOT NULL,
	CONSTRAINT `diagnosisDebts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `diagnoses` ADD CONSTRAINT `diagnoses_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `diagnosisDebts` ADD CONSTRAINT `diagnosisDebts_diagnosisId_diagnoses_id_fk` FOREIGN KEY (`diagnosisId`) REFERENCES `diagnoses`(`id`) ON DELETE cascade ON UPDATE no action;