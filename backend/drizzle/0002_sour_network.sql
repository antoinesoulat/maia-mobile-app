CREATE TABLE "session_feedback" (
	"session_id" uuid PRIMARY KEY NOT NULL,
	"energy" integer,
	"fatigue" integer,
	"motivation" integer,
	"pain" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_recommendations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"recommendation_date" date NOT NULL,
	"type" varchar(32) NOT NULL,
	"title" varchar(128) NOT NULL,
	"duration" integer NOT NULL,
	"intensity" varchar(32) NOT NULL,
	"phase" varchar(32) NOT NULL,
	"adaptation" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session_feedback" ADD CONSTRAINT "session_feedback_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_recommendations" ADD CONSTRAINT "workout_recommendations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "workout_recommendations_user_date_unique" ON "workout_recommendations" USING btree ("user_id","recommendation_date");