import Issue from "../models/issue_model.js";
import Organization from "../models/organization_model.js"; // optional for include
import Categories from "../models/category_model.js";
// GET all issues
export const getIssues = async (req, res) => {
    try {
        const response = await Issue.findAll({
            include: [{
                
                model: Organization,
                attributes: ['id', 'name']
            },
        {
                    model: Categories, // Make sure this model is defined and imported
                    attributes: ['id', 'category_name'] // Adjust as per your table schema
                }],
            attributes: {
                exclude: ['organizations_id', 'categories_id']
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// GET issue by UUID or ID param
export const getIssueById = async (req, res) => {
    try {
        const issue = await Issue.findOne({
            where: {
                id: req.params.id
            },
            include: {
                model: Organization,
                attributes: ['id', 'name']
            }
        });
        if (!issue) return res.status(404).json({ msg: "Issue not found" });
        res.status(200).json(issue);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// CREATE new issue
export const createIssue = async (req, res) => {
    const {
        description,
        priority,
        status,
        severity,
        assigned_to,
        started_by,
        petitioner_name,
        contact_type,
        contact_value,
        related_to_indicators,
        indicator_code,
        organizations_id,
        startDate,
        endDate,
        user_id,
        category_id,
        solution_id
    } = req.body;

    try {
        await Issue.create({
            description,
            priority,
            status,
            severity,
            assigned_to,
            started_by,
            petitioner_name,
            contact_type,
            contact_value,
            related_to_indicators,
            indicator_code,
            organizations_id,
            startDate,
            endDate,
            user_id,
            category_id,
            solution_id 
        });
        res.status(201).json({ msg: "Issue created successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// UPDATE issue by ID
export const updateIssue = async (req, res) => {
    const issue = await Issue.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!issue) return res.status(404).json({ msg: "Issue not found" });

    const {
        description,
        priority,
        status,
        severity,
        assigned_to,
        started_by,
        petitioner_name,
        contact_type,
        contact_value,
        related_to_indicators,
        indicator_code,
        organizations_id,
        startDate,
        endDate,
        user_id,
        category_id,
        solution_id
    } = req.body;

    try {
        await Issue.update({
            description,
            priority,
            status,
            severity,
            assigned_to,
            started_by,
            petitioner_name,
            contact_type,
            contact_value,
            related_to_indicators,
            indicator_code,
            organizations_id,
            startDate,
            endDate,
            user_id,
            category_id,
            solution_id
        }, {
            where: {
                id: issue.id
            }
        });
        res.status(200).json({ msg: "Issue updated successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// DELETE issue by ID
export const deleteIssue = async (req, res) => {
    const issue = await Issue.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!issue) return res.status(404).json({ msg: "Issue not found" });

    try {
        await Issue.destroy({
            where: {
                id: issue.id
            }
        });
        res.status(200).json({ msg: "Issue deleted successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// GET issues by user_id
export const getIssuesByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;

        const issues = await Issue.findAll({
            where: {
                user_id: user_id
            },
            include: [
                {
                    model: Organization,
                    attributes: ['id', 'name']
                },
                {
                    model: Categories,
                    attributes: ['id', 'category_name']
                }
            ],
            attributes: {
                exclude: ['organizations_id', 'category_id']
            }
        });

        if (!issues || issues.length === 0) {
            return res.status(404).json({ msg: "No issues found for this user" });
        }

        res.status(200).json(issues);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
