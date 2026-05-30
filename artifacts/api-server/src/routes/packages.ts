import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { db, packagesTable } from "@workspace/db";
import { GetPackageParams, ListPackagesResponse, GetPackageResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/packages", async (_req, res): Promise<void> => {
  const packages = await db
    .select()
    .from(packagesTable)
    .orderBy(asc(packagesTable.sortOrder));
  res.json(ListPackagesResponse.parse(packages));
});

router.get("/packages/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetPackageParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [pkg] = await db
    .select()
    .from(packagesTable)
    .where(eq(packagesTable.id, params.data.id));

  if (!pkg) {
    res.status(404).json({ error: "Package not found" });
    return;
  }

  res.json(GetPackageResponse.parse(pkg));
});

export default router;
