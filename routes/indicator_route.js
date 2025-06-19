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
router.get('/indicators', verifyUser, getIndicators);

// GET indicator by ID
router.get('/indicators/:id', verifyUser,  getIndicatorById);

// POST new indicator
router.post('/indicators', verifyUser, createIndicator);

// PATCH update indicator
router.patch('/indicators/:id', verifyUser,  updateIndicator);

// DELETE indicator
router.delete('/indicators/:id', verifyUser, deleteIndicator);

export default router;
