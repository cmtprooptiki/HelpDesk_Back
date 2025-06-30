import express from "express";
// import { groupIssuesWithAI } from "../controllers/GroupAI.js";
import { verifyUser, adminOnly } from "../middleware/auth_user.js";
import {reportAssistant, reportAnalysis } from "../controllers/reports.js"

const router = express.Router();

router.get("/reports/assistant", verifyUser, adminOnly, reportAssistant);
router.post("/reports/analyze", verifyUser, adminOnly, reportAnalysis); 

export default router;
