import { Router, type IRouter } from "express";
import { db, blockedDatesTable, bookedDatesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/availability", async (req, res): Promise<void> => {
  const [blocked, booked] = await Promise.all([
    db.select({ date: blockedDatesTable.date }).from(blockedDatesTable),
    db.select({ date: bookedDatesTable.date }).from(bookedDatesTable),
  ]);

  const unavailableDates = [
    ...blocked.map((r) => r.date),
    ...booked.map((r) => r.date),
  ];

  res.json({ unavailableDates });
});

export default router;
