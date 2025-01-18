
import { integer, text, boolean, pgTable, uuid, varchar, pgEnum, date, timestamp, bigint } from "drizzle-orm/pg-core";

export const STATUS_ENUM = pgEnum("status", ["PENDING", "APPROVED", "REJECTED"]);
export const ROLE_ENUM = pgEnum("role", ["USER", "ADMIN"]);
export const BORROW_STATUS_ENUM = pgEnum("borrow_status", ["BORROWED" , "RETURNED"]);


export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  fullName: varchar("full_name", {length : 255}).notNull(),
  email: text("email").notNull().unique(),
  universityId: varchar("university_id", { length: 255 }).notNull().unique(),
  password : text("password").notNull(),
  universitycard : text("university_card").notNull(),
  status : STATUS_ENUM("status").default("PENDING"),
  role : ROLE_ENUM("role").default("USER"),
  lastActivityDate : date("last_activity_date").defaultNow(),
  createdAt : timestamp("created_at", {
    withTimezone : true
  }).defaultNow(), 
});