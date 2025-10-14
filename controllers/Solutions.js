import Solutions from "../models/solution_model.js";
import { literal } from "sequelize";
import Issues from "../models/issue_model.js";
import Organizations from "../models/organization_model.js";
import Categories from "../models/category_model.js";
import Users from "../models/user_model.js";

// GET all solutions
export const getSolutions = async (req, res) => {
    try {
        const solutions = await Solutions.findAll();
        res.status(200).json(solutions);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// GET solution by ID
export const getSolutionById = async (req, res) => {
    try {
        const solution = await Solutions.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!solution) return res.status(404).json({ msg: "Solution not found" });
        res.status(200).json(solution);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// CREATE new solution
export const createSolution = async (req, res) => {
    const { solution_title, solution_desc } = req.body;

    try {
        const solution = await Solutions.create({
            solution_title,
            solution_desc
        });
        res.status(201).json(solution);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// UPDATE solution
export const updateSolution = async (req, res) => {
    try {
        const solution = await Solutions.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!solution) return res.status(404).json({ msg: "Solution not found" });

        const { solution_title, solution_desc } = req.body;

        await Solutions.update({
            solution_title,
            solution_desc
        }, {
            where: {
                id: solution.id
            }
        });

        res.status(200).json({ msg: "Solution updated successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// DELETE solution
export const deleteSolution = async (req, res) => {
    try {
        const solution = await Solutions.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!solution) return res.status(404).json({ msg: "Solution not found" });

        await Solutions.destroy({
            where: {
                id: solution.id
            }
        });

        res.status(200).json({ msg: "Solution deleted successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};


///

export const getSolutionsWithIssues = async (req, res) => {
  try {
    const rows = await Solutions.findAll({
      // include all solution columns
      attributes: { exclude: [] },
      include: [
        {
          model: Issues,            // JOIN on issues.solution_id = solutions.id
          attributes: ["id", "description", "assigned_to"],
          required: false,          // LEFT JOIN -> include solutions with zero issues
        },
      ],
      // optional ordering: solutions by id, then their issues by id desc
      order: [
        ["updatedAt", "DESC"],
        [Issues, "id", "DESC"],
      ],
    });



    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};