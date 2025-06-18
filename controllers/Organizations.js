import Organization from "../models/organization_model.js";

// GET all organizations
export const getOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.findAll();
        res.status(200).json(organizations);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// GET organization by ID
export const getOrganizationById = async (req, res) => {
    try {
        const organization = await Organization.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!organization) return res.status(404).json({ msg: "Organization not found" });
        res.status(200).json(organization);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// CREATE new organization
export const createOrganization = async (req, res) => {
    const {
        name,
        address,
        postal_code,
        phone_number,
        email,
        mobile_number,
        website,
        description
    } = req.body;

    try {
        await Organization.create({
            name,
            address,
            postal_code,
            phone_number,
            email,
            mobile_number,
            website,
            description
        });
        res.status(201).json({ msg: "Organization created successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// UPDATE organization by ID
export const updateOrganization = async (req, res) => {
    try {
        const organization = await Organization.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!organization) return res.status(404).json({ msg: "Organization not found" });

        const {
            name,
            address,
            postal_code,
            phone_number,
            email,
            mobile_number,
            website,
            description
        } = req.body;

        await Organization.update({
            name,
            address,
            postal_code,
            phone_number,
            email,
            mobile_number,
            website,
            description
        }, {
            where: {
                id: organization.id
            }
        });

        res.status(200).json({ msg: "Organization updated successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// DELETE organization
export const deleteOrganization = async (req, res) => {
    try {
        const organization = await Organization.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!organization) return res.status(404).json({ msg: "Organization not found" });

        await Organization.destroy({
            where: {
                id: organization.id
            }
        });

        res.status(200).json({ msg: "Organization deleted successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
