import express from "express";
import {
    getSolutions,
    getSolutionById,
    createSolution,
    updateSolution,
    deleteSolution,
    getSolutionsWithIssues
} from "../controllers/Solutions.js";

import { verifyUser, adminOnly } from "../middleware/auth_user.js";

const router = express.Router();

// GET all solutions (admin only)
router.get('/solutions', verifyUser,  getSolutions);

// GET solution by ID
router.get('/solutions/:id', verifyUser, getSolutionById);

// POST new solution
router.post('/solutions', verifyUser,  createSolution);

// PATCH update solution
router.patch('/solutions/:id', verifyUser,  updateSolution);

// DELETE solution
router.delete('/solutions/:id', verifyUser,  deleteSolution);

router.get('/solutions_with_issues', getSolutionsWithIssues);


export default router;
