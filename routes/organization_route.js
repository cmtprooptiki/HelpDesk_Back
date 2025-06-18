import express from "express";
import {
    getOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization,
    deleteOrganization
} from "../controllers/Organizations.js";

import { verifyUser, adminOnly } from "../middleware/auth_user.js";

const router = express.Router();

// GET all organizations (admin only)
router.get('/organizations', verifyUser, adminOnly, getOrganizations);

// GET organization by ID
router.get('/organizations/:id', verifyUser, adminOnly, getOrganizationById);

// POST new organization
router.post('/organizations', verifyUser, adminOnly, createOrganization);

// PATCH update organization
router.patch('/organizations/:id', verifyUser, adminOnly, updateOrganization);

// DELETE organization
router.delete('/organizations/:id', verifyUser, adminOnly, deleteOrganization);

export default router;
