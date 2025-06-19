import express from "express";
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/Categories.js";

import { verifyUser, adminOnly } from "../middleware/auth_user.js";

const router = express.Router();

// GET all categories (admin only)
router.get('/categories', verifyUser,  getCategories);

// GET category by ID
router.get('/categories/:id', verifyUser,  getCategoryById);

// POST new category
router.post('/categories', verifyUser,  createCategory);

// PATCH update category
router.patch('/categories/:id', verifyUser,  updateCategory);

// DELETE category
router.delete('/categories/:id', verifyUser, deleteCategory);

export default router;
