CREATE TABLE IF NOT EXISTS "users" (
	"id" char(36) PRIMARY KEY NOT NULL,
	"age" integer,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "age_name_idx" ON "users" ("age","name") WHERE "age" IS NOT NULL;