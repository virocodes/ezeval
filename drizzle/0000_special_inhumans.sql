CREATE TABLE "evals" (
	"id" serial PRIMARY KEY NOT NULL,
	"experiment_id" integer,
	"model_name" varchar(255) NOT NULL,
	"response" text NOT NULL,
	"evaluator_response" text NOT NULL,
	"score" numeric DEFAULT '0',
	"response_time" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "experiments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "evals" ADD CONSTRAINT "evals_experiment_id_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiments" ADD CONSTRAINT "experiments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;