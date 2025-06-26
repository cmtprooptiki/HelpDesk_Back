import express from "express";
// import { groupIssuesWithAI } from "../controllers/GroupAI.js";
import { verifyUser, adminOnly } from "../middleware/auth_user.js";
import {reportAssistant} from "../controllers/reports.js"

const router = express.Router();

router.get("/reports/assistant", verifyUser, adminOnly, reportAssistant);

export default router;
