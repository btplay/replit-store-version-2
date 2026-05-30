import { Router, type IRouter } from "express";
import { db, contactsTable } from "@workspace/db";
import { CreateContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contacts", async (req, res): Promise<void> => {
  const parsed = CreateContactBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid contact body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [contact] = await db
    .insert(contactsTable)
    .values(parsed.data)
    .returning();

  req.log.info({ contactId: contact.id }, "New contact message received");
  res.status(201).json({
    id: contact.id,
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    message: contact.message,
    createdAt: contact.createdAt.toISOString(),
  });
});

export default router;
