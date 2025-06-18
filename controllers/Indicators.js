import Indicator from "../models/indicators_model.js";

// GET all indicators
export const getIndicators = async (req, res) => {
    try {
        const indicators = await Indicator.findAll();
        res.status(200).json(indicators);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// GET indicator by ID
export const getIndicatorById = async (req, res) => {
    try {
        const indicator = await Indicator.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!indicator) return res.status(404).json({ msg: "Indicator not found" });
        res.status(200).json(indicator);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// CREATE new indicator
export const createIndicator = async (req, res) => {
    const { code, description } = req.body;

    try {
        await Indicator.create({
            code,
            description
        });
        res.status(201).json({ msg: "Indicator created successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// UPDATE indicator
export const updateIndicator = async (req, res) => {
    try {
        const indicator = await Indicator.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!indicator) return res.status(404).json({ msg: "Indicator not found" });

        const { code, description } = req.body;

        await Indicator.update({
            code,
            description
        }, {
            where: {
                id: indicator.id
            }
        });

        res.status(200).json({ msg: "Indicator updated successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// DELETE indicator
export const deleteIndicator = async (req, res) => {
    try {
        const indicator = await Indicator.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!indicator) return res.status(404).json({ msg: "Indicator not found" });

        await Indicator.destroy({
            where: {
                id: indicator.id
            }
        });

        res.status(200).json({ msg: "Indicator deleted successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
