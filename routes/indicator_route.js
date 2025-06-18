import express from "express";
import {
    getIndicators,
    getIndicatorById,
    createIndicator,
    updateIndicator,
    deleteIndicator
} from "../controllers/Indicators.js";

import { verifyUser, adminOnly } from "../middleware/auth_user.js";

const router = express.Router();

// GET all indicators (admin only)
router.get('/indicators', verifyUser, adminOnly, getIndicators);

// GET indicator by ID
router.get('/indicators/:id', verifyUser, adminOnly, getIndicatorById);

// POST new indicator
router.post('/indicators', verifyUser, adminOnly, createIndicator);

// PATCH update indicator
router.patch('/indicators/:id', verifyUser, adminOnly, updateIndicator);

// DELETE indicator
router.delete('/indicators/:id', verifyUser, adminOnly, deleteIndicator);

export default router;
