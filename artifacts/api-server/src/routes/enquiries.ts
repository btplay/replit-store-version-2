import { Router, type IRouter } from "express";
import { db, enquiriesTable, bookedDatesTable } from "@workspace/db";
import { CreateEnquiryBody } from "@workspace/api-zod";
import { randomBytes } from "crypto";
import { sendOwnerNotification, sendClientConfirmation } from "../lib/email";

const router: IRouter = Router();

function generateBookingReference(): string {
  const prefix = "BTP";
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${suffix}`;
}

router.post("/enquiries", async (req, res): Promise<void> => {
  const parsed = CreateEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid enquiry body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const bookingReference = generateBookingReference();
  const { deliveryCharge, ...rest } = parsed.data as typeof parsed.data & { deliveryCharge?: number | null };

  const [enquiry] = await db
    .insert(enquiriesTable)
    .values({
      ...rest,
      deliveryCharge: deliveryCharge != null ? String(deliveryCharge) : null,
      status: "enquiry_received",
      bookingReference,
    })
    .returning();

  // Mark the date as booked if provided
  if (enquiry.eventDate) {
    await db.insert(bookedDatesTable).values({
      date: enquiry.eventDate,
      bookingReference,
      clientName: enquiry.name,
    }).onConflictDoNothing();
  }

  req.log.info({ enquiryId: enquiry.id, bookingReference }, "New enquiry received");

  const emailData = {
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    eventDate: enquiry.eventDate,
    eventTime: enquiry.eventTime,
    venue: enquiry.venue,
    eventType: enquiry.eventType,
    packageInterest: enquiry.packageInterest,
    guestCount: enquiry.guestCount,
    deliveryCharge: enquiry.deliveryCharge ? Number(enquiry.deliveryCharge) : null,
    additionalDetails: enquiry.additionalDetails,
    bookingReference: enquiry.bookingReference ?? bookingReference,
  };

  void Promise.all([
    sendOwnerNotification(emailData),
    sendClientConfirmation(emailData),
  ]);

  res.status(201).json({
    id: enquiry.id,
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    eventDate: enquiry.eventDate,
    eventTime: enquiry.eventTime,
    venue: enquiry.venue,
    eventType: enquiry.eventType,
    childAgeRange: enquiry.childAgeRange,
    packageInterest: enquiry.packageInterest,
    guestCount: enquiry.guestCount,
    deliveryCharge: enquiry.deliveryCharge,
    additionalDetails: enquiry.additionalDetails,
    status: enquiry.status,
    deliveryConfirmed: enquiry.deliveryConfirmed,
    bookingReference: enquiry.bookingReference,
    createdAt: enquiry.createdAt.toISOString(),
  });
});

export default router;
