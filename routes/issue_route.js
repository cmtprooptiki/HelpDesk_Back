import express from "express";
import {
    getIssues,
    getIssueById,
    createIssue,
    updateIssue,
    deleteIssue
} from "../controllers/Issues.js";
import { verifyUser, adminOnly } from "../middleware/auth_user.js";

const router = express.Router();

// GET all issues (admin only)
router.get('/issues', verifyUser, adminOnly, getIssues);

// GET issue by ID (admin only)
router.get('/issues/:id', verifyUser, adminOnly, getIssueById);

// POST a new issue (admin only)
router.post('/issues', verifyUser, adminOnly, createIssue);

// PATCH update an existing issue (admin only)
router.patch('/issues/:id', verifyUser, adminOnly, updateIssue);

// DELETE an issue (admin only)
router.delete('/issues/:id', verifyUser, adminOnly, deleteIssue);

export default router;
