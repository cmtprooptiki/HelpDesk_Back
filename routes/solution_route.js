import express from "express";
import {
    getSolutions,
    getSolutionById,
    createSolution,
    updateSolution,
    deleteSolution
} from "../controllers/Solutions.js";

import { verifyUser, adminOnly } from "../middleware/auth_user.js";

const router = express.Router();

// GET all solutions (admin only)
router.get('/solutions', verifyUser, adminOnly, getSolutions);

// GET solution by ID
router.get('/solutions/:id', verifyUser, adminOnly, getSolutionById);

// POST new solution
router.post('/solutions', verifyUser, adminOnly, createSolution);

// PATCH update solution
router.patch('/solutions/:id', verifyUser, adminOnly, updateSolution);

// DELETE solution
router.delete('/solutions/:id', verifyUser, adminOnly, deleteSolution);

export default router;
