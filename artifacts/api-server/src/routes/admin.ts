import { Router, type IRouter } from "express";
import { db, enquiriesTable, testimonialsTable, faqItemsTable, galleryImagesTable, socialLinksTable, blockedDatesTable, bookedDatesTable, packagesTable, contactsTable, newsletterTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { adminAuthMiddleware, checkCredentials, createAdminSession, deleteAdminSession } from "../lib/adminAuth";
import { sendOwnerNotification } from "../lib/email";
import { BrevoClient } from "@getbrevo/brevo";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const brevo = new BrevoClient({ apiKey: process.env["BREVO_API_KEY"] ?? "" });

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post("/admin/login", async (req, res): Promise<void> => {
  const { username, password } = req.body ?? {};
  if (!checkCredentials(username, password)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = await createAdminSession();
  res.json({ token });
});

router.post("/admin/logout", adminAuthMiddleware, async (req, res): Promise<void> => {
  const token = req.headers.authorization!.slice(7);
  await deleteAdminSession(token);
  res.json({ ok: true });
});

// ── Enquiries ─────────────────────────────────────────────────────────────────
router.get("/admin/enquiries", adminAuthMiddleware, async (req, res): Promise<void> => {
  const enquiries = await db.select().from(enquiriesTable).orderBy(desc(enquiriesTable.createdAt));
  res.json(enquiries.map(e => ({ ...e, deliveryCharge: e.deliveryCharge?.toString() ?? null, createdAt: e.createdAt.toISOString() })));
});

router.patch("/admin/enquiries/:id", adminAuthMiddleware, async (req, res): Promise<void> => {
  const id = Number(req.params["id"]);
  const { status, adminNotes, deliveryConfirmed } = req.body ?? {};
  const updates: Record<string, string> = {};
  if (status) updates["status"] = status;
  if (adminNotes !== undefined) updates["adminNotes"] = adminNotes;
  if (deliveryConfirmed) updates["deliveryConfirmed"] = deliveryConfirmed;
  const [updated] = await db.update(enquiriesTable).set(updates).where(eq(enquiriesTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...updated, deliveryCharge: updated.deliveryCharge?.toString() ?? null, createdAt: updated.createdAt.toISOString() });
});

router.post("/admin/enquiries/:id/confirm-delivery", adminAuthMiddleware, async (req, res): Promise<void> => {
  const id = Number(req.params["id"]);
  const [enquiry] = await db.update(enquiriesTable).set({ deliveryConfirmed: "confirmed" }).where(eq(enquiriesTable.id, id)).returning();
  if (!enquiry) { res.status(404).json({ error: "Not found" }); return; }

  // Send confirmation email via Brevo
  try {
    await brevo.transactionalEmails.sendTransacEmail({
      to: [{ email: enquiry.email, name: enquiry.name }],
      sender: { name: "BT Play", email: "hello@btplay.co.uk" },
      subject: `Your BT Play booking is confirmed — ${enquiry.bookingReference}`,
      htmlContent: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1e293b;">
          <div style="background:#B5C2B7;padding:32px 40px;">
            <h1 style="color:white;margin:0;font-size:22px;letter-spacing:2px;">BT PLAY</h1>
            <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Luxury Soft Play Hire · Hertfordshire</p>
          </div>
          <div style="padding:40px;background:white;border:1px solid #e2e8f0;border-top:none;">
            <h2 style="font-size:20px;margin:0 0 16px;color:#1e293b;">Great news, ${enquiry.name}!</h2>
            <p style="color:#475569;line-height:1.7;margin:0 0 16px;">We are delighted to confirm that we are able to deliver your BT Play setup for your <strong>${enquiry.eventType}</strong>${enquiry.eventDate ? ` on <strong>${enquiry.eventDate}</strong>${enquiry.eventTime ? ` at <strong>${enquiry.eventTime}</strong>` : ""}` : ""}.</p>
            <p style="color:#475569;line-height:1.7;margin:0 0 16px;">Your booking reference is <strong style="color:#B5C2B7;">${enquiry.bookingReference}</strong>. We will be in touch soon with final details.</p>
            <p style="color:#475569;line-height:1.7;margin:0;">Any questions? Email us at <a href="mailto:hello@btplay.co.uk" style="color:#B5C2B7;">hello@btplay.co.uk</a>.</p>
            <p style="color:#475569;line-height:1.7;margin:16px 0 0;">Warm regards,<br><strong>The BT Play Team</strong></p>
          </div>
        </div>
      `,
    });
    logger.info({ enquiryId: id }, "Delivery confirmation email sent");
  } catch (err) {
    logger.error({ err, enquiryId: id }, "Failed to send delivery confirmation email");
  }

  res.json({ ok: true, deliveryConfirmed: "confirmed" });
});

router.post("/admin/enquiries/:id/reply", adminAuthMiddleware, async (req, res): Promise<void> => {
  const id = Number(req.params["id"]);
  const { message } = req.body ?? {};
  const enquiries = await db.select().from(enquiriesTable).where(eq(enquiriesTable.id, id)).limit(1);
  if (!enquiries.length) { res.status(404).json({ error: "Not found" }); return; }
  const enquiry = enquiries[0];

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      to: [{ email: enquiry.email, name: enquiry.name }],
      sender: { name: "BT Play", email: "hello@btplay.co.uk" },
      subject: `Re: Your BT Play enquiry — ${enquiry.bookingReference}`,
      htmlContent: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1e293b;">
          <div style="background:#B5C2B7;padding:32px 40px;">
            <h1 style="color:white;margin:0;font-size:22px;letter-spacing:2px;">BT PLAY</h1>
          </div>
          <div style="padding:40px;background:white;border:1px solid #e2e8f0;border-top:none;">
            <p style="color:#475569;line-height:1.8;">${message?.replace(/\n/g, "<br>") ?? ""}</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
            <p style="font-size:12px;color:#94a3b8;">BT Play · Hertfordshire · hello@btplay.co.uk</p>
          </div>
        </div>
      `,
    });
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Failed to send reply email");
    res.status(500).json({ error: "Failed to send email" });
  }
});

// ── Calendar ──────────────────────────────────────────────────────────────────
router.get("/admin/calendar", adminAuthMiddleware, async (req, res): Promise<void> => {
  const [blocked, booked] = await Promise.all([
    db.select().from(blockedDatesTable),
    db.select().from(bookedDatesTable),
  ]);
  res.json({ blocked, booked });
});

router.post("/admin/calendar/block", adminAuthMiddleware, async (req, res): Promise<void> => {
  const { date, reason } = req.body ?? {};
  await db.insert(blockedDatesTable).values({ date, reason }).onConflictDoNothing();
  res.json({ ok: true });
});

router.delete("/admin/calendar/block/:date", adminAuthMiddleware, async (req, res): Promise<void> => {
  await db.delete(blockedDatesTable).where(eq(blockedDatesTable.date, String(req.params["date"])));
  res.json({ ok: true });
});

router.post("/admin/calendar/booked", adminAuthMiddleware, async (req, res): Promise<void> => {
  const { date, bookingReference, clientName } = req.body ?? {};
  await db.insert(bookedDatesTable).values({ date, bookingReference, clientName }).onConflictDoNothing();
  res.json({ ok: true });
});

router.delete("/admin/calendar/booked/:date", adminAuthMiddleware, async (req, res): Promise<void> => {
  await db.delete(bookedDatesTable).where(eq(bookedDatesTable.date, String(req.params["date"])));
  res.json({ ok: true });
});

// ── Gallery ───────────────────────────────────────────────────────────────────
router.get("/admin/gallery", adminAuthMiddleware, async (req, res): Promise<void> => {
  const images = await db.select().from(galleryImagesTable).orderBy(galleryImagesTable.sortOrder);
  res.json(images);
});

router.post("/admin/gallery", adminAuthMiddleware, async (req, res): Promise<void> => {
  const { src, alt, category, sortOrder } = req.body ?? {};
  const [img] = await db.insert(galleryImagesTable).values({ src, alt: alt ?? "", category: category ?? "All", sortOrder: sortOrder ?? 0 }).returning();
  res.status(201).json(img);
});

router.delete("/admin/gallery/:id", adminAuthMiddleware, async (req, res): Promise<void> => {
  await db.delete(galleryImagesTable).where(eq(galleryImagesTable.id, Number(req.params["id"])));
  res.json({ ok: true });
});

// ── FAQ ───────────────────────────────────────────────────────────────────────
router.get("/admin/faq", adminAuthMiddleware, async (req, res): Promise<void> => {
  const items = await db.select().from(faqItemsTable).orderBy(faqItemsTable.sortOrder);
  res.json(items);
});

router.post("/admin/faq", adminAuthMiddleware, async (req, res): Promise<void> => {
  const { question, answer, sortOrder } = req.body ?? {};
  const [item] = await db.insert(faqItemsTable).values({ question, answer, sortOrder: sortOrder ?? 0 }).returning();
  res.status(201).json(item);
});

router.put("/admin/faq/:id", adminAuthMiddleware, async (req, res): Promise<void> => {
  const { question, answer, sortOrder } = req.body ?? {};
  const [item] = await db.update(faqItemsTable).set({ question, answer, sortOrder }).where(eq(faqItemsTable.id, Number(req.params["id"]))).returning();
  res.json(item);
});

router.delete("/admin/faq/:id", adminAuthMiddleware, async (req, res): Promise<void> => {
  await db.delete(faqItemsTable).where(eq(faqItemsTable.id, Number(req.params["id"])));
  res.json({ ok: true });
});

// ── Reviews ───────────────────────────────────────────────────────────────────
router.get("/admin/reviews", adminAuthMiddleware, async (req, res): Promise<void> => {
  const reviews = await db.select().from(testimonialsTable).orderBy(desc(testimonialsTable.createdAt));
  res.json(reviews);
});

router.post("/admin/reviews", adminAuthMiddleware, async (req, res): Promise<void> => {
  const { customerName, eventType, quote, rating, location } = req.body ?? {};
  const [review] = await db.insert(testimonialsTable).values({ customerName, eventType, quote, rating: rating ?? 5, location }).returning();
  res.status(201).json(review);
});

router.put("/admin/reviews/:id", adminAuthMiddleware, async (req, res): Promise<void> => {
  const { customerName, eventType, quote, rating, location } = req.body ?? {};
  const [review] = await db.update(testimonialsTable).set({ customerName, eventType, quote, rating, location }).where(eq(testimonialsTable.id, Number(req.params["id"]))).returning();
  res.json(review);
});

router.delete("/admin/reviews/:id", adminAuthMiddleware, async (req, res): Promise<void> => {
  await db.delete(testimonialsTable).where(eq(testimonialsTable.id, Number(req.params["id"])));
  res.json({ ok: true });
});

// ── Social Links ──────────────────────────────────────────────────────────────
router.get("/admin/social", adminAuthMiddleware, async (req, res): Promise<void> => {
  const links = await db.select().from(socialLinksTable).orderBy(socialLinksTable.sortOrder);
  res.json(links);
});

router.post("/admin/social", adminAuthMiddleware, async (req, res): Promise<void> => {
  const { platform, url, handle, active, sortOrder } = req.body ?? {};
  const [link] = await db.insert(socialLinksTable).values({ platform, url, handle, active: active ?? true, sortOrder: sortOrder ?? 0 }).returning();
  res.status(201).json(link);
});

router.put("/admin/social/:id", adminAuthMiddleware, async (req, res): Promise<void> => {
  const { platform, url, handle, active, sortOrder } = req.body ?? {};
  const [link] = await db.update(socialLinksTable).set({ platform, url, handle, active, sortOrder }).where(eq(socialLinksTable.id, Number(req.params["id"]))).returning();
  res.json(link);
});

router.delete("/admin/social/:id", adminAuthMiddleware, async (req, res): Promise<void> => {
  await db.delete(socialLinksTable).where(eq(socialLinksTable.id, Number(req.params["id"])));
  res.json({ ok: true });
});

// ── Marketing Email ───────────────────────────────────────────────────────────
router.post("/admin/marketing/send", adminAuthMiddleware, async (req, res): Promise<void> => {
  const { subject, htmlContent } = req.body ?? {};
  if (!subject || !htmlContent) { res.status(400).json({ error: "subject and htmlContent required" }); return; }

  const [enquiryContacts, directContacts, newsletterSubs] = await Promise.all([
    db.select({ email: enquiriesTable.email, name: enquiriesTable.name }).from(enquiriesTable),
    db.select({ email: contactsTable.email, name: contactsTable.name }).from(contactsTable),
    db.select({ email: newsletterTable.email, name: newsletterTable.name }).from(newsletterTable),
  ]);

  const allEmails = new Map<string, string>();
  for (const c of [...enquiryContacts, ...directContacts, ...newsletterSubs]) {
    if (c.email && !allEmails.has(c.email)) allEmails.set(c.email, c.name ?? "");
  }

  const recipients = Array.from(allEmails.entries()).map(([email, name]) => ({ email, name }));
  if (!recipients.length) { res.json({ sent: 0 }); return; }

  let sent = 0;
  // Send in batches of 50
  for (let i = 0; i < recipients.length; i += 50) {
    const batch = recipients.slice(i, i + 50);
    try {
      await brevo.transactionalEmails.sendTransacEmail({
        to: batch,
        sender: { name: "BT Play", email: "hello@btplay.co.uk" },
        subject,
        htmlContent,
      });
      sent += batch.length;
    } catch (err) {
      logger.error({ err }, "Marketing email batch failed");
    }
  }

  res.json({ sent, total: recipients.length });
});

export default router;
