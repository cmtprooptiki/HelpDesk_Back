import express from "express";
import {
    getIssues,
    getIssueById,
    createIssue,
    updateIssue,
    deleteIssue,
    getIssuesByUserId
} from "../controllers/Issues.js";
import { verifyUser, adminOnly } from "../middleware/auth_user.js";

const router = express.Router();

// GET all issues (admin only)
router.get('/issues', verifyUser, adminOnly, getIssues);

// GET issue by ID (admin only)
router.get('/issues/:id', verifyUser,getIssueById);

router.get('/issues/user/:user_id', verifyUser, getIssuesByUserId);

// POST a new issue (admin only)
router.post('/issues', verifyUser, createIssue);

// PATCH update an existing issue (admin only)
router.patch('/issues/:id', verifyUser, updateIssue);

// DELETE an issue (admin only)
router.delete('/issues/:id', verifyUser,deleteIssue);

export default router;
