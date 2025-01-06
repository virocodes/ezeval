import { pgTable, serial, text, varchar, numeric, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
});

export const experiments = pgTable("experiments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
})

export const evals = pgTable("evals", {
  id: serial("id").primaryKey(),
  experimentId: integer("experiment_id").references(() => experiments.id),
  modelName: varchar("model_name", { length: 255 }).notNull(),
  response: text("response").notNull(),
  evaluatorResponse: text("evaluator_response").notNull(),
  score: numeric("score").default('0'),
  responseTime: integer("response_time").default(0),
})

