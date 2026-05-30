import { Router, type IRouter } from "express";
import healthRouter from "./health";
import packagesRouter from "./packages";
import testimonialsRouter from "./testimonials";
import enquiriesRouter from "./enquiries";
import contactsRouter from "./contacts";
import newsletterRouter from "./newsletter";
import availabilityRouter from "./availability";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(packagesRouter);
router.use(testimonialsRouter);
router.use(enquiriesRouter);
router.use(contactsRouter);
router.use(newsletterRouter);
router.use(availabilityRouter);
router.use(adminRouter);

export default router;
