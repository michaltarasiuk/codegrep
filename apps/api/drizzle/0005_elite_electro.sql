ALTER TABLE "user" RENAME COLUMN "personalInstructions" TO "personal_instructions";--> statement-breakpoint
ALTER TABLE "chat" ADD COLUMN "share_id" text;
