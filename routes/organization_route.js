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
router.get('/organizations', verifyUser, getOrganizations);

// GET organization by ID
router.get('/organizations/:id', verifyUser, getOrganizationById);

// POST new organization
router.post('/organizations', verifyUser,createOrganization);

// PATCH update organization
router.patch('/organizations/:id', verifyUser, updateOrganization);

// DELETE organization
router.delete('/organizations/:id', verifyUser, deleteOrganization);

export default router;
