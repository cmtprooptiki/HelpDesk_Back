import Categories from "../models/category_model.js";

// GET all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Categories.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// GET category by ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await Categories.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!category) return res.status(404).json({ msg: "Category not found" });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// CREATE new category
export const createCategory = async (req, res) => {
    const { category_name } = req.body;

    try {
        await Categories.create({
            category_name
        });
        res.status(201).json({ msg: "Category created successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// UPDATE category
export const updateCategory = async (req, res) => {
    try {
        const category = await Categories.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!category) return res.status(404).json({ msg: "Category not found" });

        const { category_name } = req.body;

        await Categories.update({
            category_name
        }, {
            where: {
                id: category.id
            }
        });

        res.status(200).json({ msg: "Category updated successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// DELETE category
export const deleteCategory = async (req, res) => {
    try {
        const category = await Categories.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!category) return res.status(404).json({ msg: "Category not found" });

        await Categories.destroy({
            where: {
                id: category.id
            }
        });

        res.status(200).json({ msg: "Category deleted successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
