import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const blockedDatesTable = pgTable("blocked_dates", {
  id: serial("id").primaryKey(),
  date: text("date").notNull().unique(),
  reason: text("reason"),
  blockedAt: timestamp("blocked_at", { withTimezone: true }).notNull().defaultNow(),
});

export const bookedDatesTable = pgTable("booked_dates", {
  id: serial("id").primaryKey(),
  date: text("date").notNull().unique(),
  bookingReference: text("booking_reference"),
  clientName: text("client_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBlockedDateSchema = createInsertSchema(blockedDatesTable).omit({ id: true, blockedAt: true });
export type InsertBlockedDate = z.infer<typeof insertBlockedDateSchema>;
export type BlockedDate = typeof blockedDatesTable.$inferSelect;

export const insertBookedDateSchema = createInsertSchema(bookedDatesTable).omit({ id: true, createdAt: true });
export type InsertBookedDate = z.infer<typeof insertBookedDateSchema>;
export type BookedDate = typeof bookedDatesTable.$inferSelect;
