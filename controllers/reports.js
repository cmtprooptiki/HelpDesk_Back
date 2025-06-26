import Issue from "../models/issue_model.js";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
import { Op } from "sequelize";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const reportAssistant = async (req, res) => {
  try {
    // 🗃️ Fetch issues with descriptions
    const issues = await Issue.findAll({
      attributes: ["id", "description"],
      where: {
        description: { [Op.not]: null }
      }
    });

    if (!issues || issues.length === 0) {
      return res.status(404).json({ msg: "No issue descriptions found" });
    }

    // 📋 Format input for GPT
    const listText = issues
      .map((issue) => `${issue.id}. ${issue.description}`)
      .join("\n");

    const prompt = `
The following is a list of IT support issue descriptions. Group them by similarity.

Return a valid JSON array where each object contains:
- group_name
- issue_ids (as array of integers)
- amount (count of issues in group)

Example:
[
  { "group_name": "Printer Problems", "issue_ids": [1, 4, 7], "amount": 3 },
  { "group_name": "VPN Errors", "issue_ids": [2], "amount": 1 }
]

Issues:
${listText}
`;

    // 🧠 GPT call
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }]
    });

    const output = response.choices[0].message.content.trim();

    // ✅ Try to parse as JSON
    try {
      const json = JSON.parse(output);
      return res.status(200).json(json);
    } catch (err) {
      return res.status(500).json({
        msg: "Failed to parse GPT response as JSON.",
        raw: output
      });
    }
  } catch (error) {
    console.error("GPT grouping failed:", error);
    return res.status(500).json({ msg: "AI grouping failed", error: error.message });
  }
};
