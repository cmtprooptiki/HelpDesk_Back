import express from "express";
// import { groupIssuesWithAI } from "../controllers/GroupAI.js";
import { verifyUser, adminOnly } from "../middleware/auth_user.js";
import {
    reportAssistant,
    reportAnalysis,
    reportSummary,
    reportByOrganization,
    reportTrends,
    reportFullExport
} from "../controllers/reports.js"

const router = express.Router();

// Existing AI grouping endpoints
router.get("/reports/assistant", verifyUser, adminOnly, reportAssistant);
router.post("/reports/analyze", verifyUser, adminOnly, reportAnalysis);

// New WHO Health IQ 6-month report endpoints (consumed by generate_report.py)
router.get("/reports/summary",         verifyUser, adminOnly, reportSummary);
router.get("/reports/by-organization", verifyUser, adminOnly, reportByOrganization);
router.get("/reports/trends",          verifyUser, adminOnly, reportTrends);
router.get("/reports/full-export",     verifyUser, adminOnly, reportFullExport);

export default router;
