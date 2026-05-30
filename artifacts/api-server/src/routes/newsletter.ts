import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, newsletterTable } from "@workspace/db";
import { SubscribeNewsletterBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/newsletter", async (req, res): Promise<void> => {
  const parsed = SubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid newsletter body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db
    .select()
    .from(newsletterTable)
    .where(eq(newsletterTable.email, parsed.data.email))
    .limit(1);

  if (existing.length > 0) {
    res.status(409).json({ error: "Already subscribed" });
    return;
  }

  const [subscriber] = await db
    .insert(newsletterTable)
    .values(parsed.data)
    .returning();

  req.log.info({ subscriberId: subscriber.id }, "New newsletter subscriber");
  res.status(201).json({
    id: subscriber.id,
    email: subscriber.email,
    name: subscriber.name,
    marketingConsent: subscriber.marketingConsent,
    createdAt: subscriber.createdAt.toISOString(),
  });
});

export default router;
