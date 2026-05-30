import { pgTable, text, serial, integer, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const enquiriesTable = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  eventDate: text("event_date"),
  eventTime: text("event_time"),
  venue: text("venue"),
  eventType: text("event_type").notNull(),
  childAgeRange: text("child_age_range"),
  packageInterest: text("package_interest").notNull(),
  guestCount: integer("guest_count"),
  deliveryCharge: numeric("delivery_charge", { precision: 10, scale: 2 }),
  additionalDetails: text("additional_details"),
  status: text("status").notNull().default("enquiry_received"),
  deliveryConfirmed: text("delivery_confirmed").notNull().default("pending"),
  bookingReference: text("booking_reference"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertEnquirySchema = createInsertSchema(enquiriesTable).omit({ id: true, createdAt: true, status: true, bookingReference: true });
export type InsertEnquiry = z.infer<typeof insertEnquirySchema>;
export type Enquiry = typeof enquiriesTable.$inferSelect;
