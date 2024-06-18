CREATE TABLE IF NOT EXISTS "workflows" (
	"id" char(36) PRIMARY KEY NOT NULL,
	"version" integer NOT NULL,
	"data" json NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
