// import Issue from "../models/issue_model.js";
// import Category from "../models/category_model.js";

// import OpenAI from "openai";
// import dotenv from "dotenv";
// dotenv.config();
// import { Op } from "sequelize";
// import dayjs from "dayjs";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//IPPO VERSION
// export const reportAssistant = async (req, res) => {
//   try {
//     // 🗃️ Fetch issues with descriptions
//     const issues = await Issue.findAll({
//       attributes: ["id", "description"],
//       where: {
//         description: { [Op.not]: null }
//       }
//     });

//     if (!issues || issues.length === 0) {
//       return res.status(404).json({ msg: "No issue descriptions found" });
//     }

//     // 📋 Format input for GPT
//     const listText = issues
//       .map((issue) => `${issue.id}. ${issue.description}`)
//       .join("\n");

//     const prompt = `
// The following is a list of IT support issue descriptions. Group them by similarity.

// Return a valid JSON array where each object contains:
// - group_name
// - issue_ids (as array of integers)
// - amount (count of issues in group)

// Example:
// [
//   { "group_name": "Printer Problems", "issue_ids": [1, 4, 7], "amount": 3 },
//   { "group_name": "VPN Errors", "issue_ids": [2], "amount": 1 }
// ]

// Issues:
// ${listText}
// `;

//     // 🧠 GPT call
//     const response = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [{ role: "user", content: prompt }]
//     });

//     const output = response.choices[0].message.content.trim();

//     // ✅ Try to parse as JSON
//     try {
//       const json = JSON.parse(output);
//       return res.status(200).json(json);
//     } catch (err) {
//       return res.status(500).json({
//         msg: "Failed to parse GPT response as JSON.",
//         raw: output
//       });
//     }
//   } catch (error) {
//     console.error("GPT grouping failed:", error);
//     return res.status(500).json({ msg: "AI grouping failed", error: error.message });
//   }
// };



//With Month STABLE IT WORKS

import Issue from "../models/issue_model.js";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
import { Op } from "sequelize";
import dayjs from "dayjs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const reportAssistant = async (req, res) => {
  try {
    // 📅 Get selected month or default to current month
    const monthParam = req.query.month || dayjs().format("YYYY-MM");
    const startOfMonth = dayjs(monthParam).startOf("month").toDate();
    const endOfMonth = dayjs(monthParam).endOf("month").toDate();

    // 🗃️ Fetch filtered issues with non-null description
    const issues = await Issue.findAll({
      attributes: ["id", "description"],
      where: {
        description: { [Op.not]: null },
        [Op.or]: [
          { endDate: null },
          { endDate: { [Op.between]: [startOfMonth, endOfMonth] } }
        ]
      }
    });

    if (!issues || issues.length < 2) {
      return res.status(400).json({ msg: "Not enough issues to group meaningfully." });
    }

    // 📋 Format input for GPT
    const listText = issues
      .map((issue) => `${issue.id}. ${issue.description}`)
      .join("\n");

    const prompt = `
You are an assistant tasked with grouping issues by similarity.

Return ONLY a valid JSON array, where each object contains:
- "group_name": a short label
- "issue_ids": an array of integers
- "count": number of issues in the group

If no groupings are possible, return: []

Example:
[
  { "group_name": "Printer Problems", "issue_ids": [1, 4, 7], "count": 3 },
  { "group_name": "VPN Errors", "issue_ids": [2], "count": 1 }
]

Issues:
${listText}
`;

    // 🧠 Call GPT-4
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }]
    });

    const output = response.choices[0].message.content.trim();

    // ✅ Attempt to parse JSON
    try {
      if (!output.startsWith("[")) {
        throw new Error("Output does not start with a JSON array");
      }

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



//****************** **************************************/ 

//new try with categories logic with have to rethink again WHY WE NEED to create new categories.We already have from the database
//****************** ***********************************/ 

// export const reportAssistant = async (req, res) => {
//   try {
//     const monthParam = req.query.month || dayjs().format("YYYY-MM");
//     const startOfMonth = dayjs(monthParam).startOf("month").toDate();
//     const endOfMonth = dayjs(monthParam).endOf("month").toDate();

//     // 🗃️ Fetch issues for the month
//     const issues = await Issue.findAll({
//       attributes: ["id", "description"],
//       where: {
//         description: { [Op.not]: null },
//         [Op.or]: [
//           { endDate: null },
//           { endDate: { [Op.between]: [startOfMonth, endOfMonth] } }
//         ]
//       }
//     });

//     if (!issues || issues.length < 2) {
//       return res.status(400).json({ msg: "Not enough issues to group meaningfully." });
//     }

//     // 📚 Fetch existing categories
//     const categories = await Category.findAll({ attributes: ["category_name"] });
//     const existingCategoryNames = categories.map(c => c.category_name);

//     // 📋 Format input
//     const issuesText = issues.map(issue => `${issue.id}. ${issue.description}`).join("\n");
//     const categoryText = existingCategoryNames.length > 0
//       ? `Here are the existing categories:\n- ${existingCategoryNames.join("\n- ")}\n`
//       : "";

//     const prompt = `
// You are an assistant categorizing issues.

// ${categoryText}

// Please categorize the following issues. Try to use existing categories if they fit. Only create new categories if absolutely necessary.

// Return a valid JSON array of objects like this:
// [
//   {
//     "group_name": "Printer Problems", 
//     "issue_ids": [1, 2], 
//     "count": 2
//   },
//   {
//     "group_name": "New Category Example", 
//     "issue_ids": [3], 
//     "count": 1
//   }
// ]

// Issues:
// ${issuesText}
// `;

//     // 🔁 OpenAI call
//     const response = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [{ role: "user", content: prompt }]
//     });

//     const output = response.choices[0].message.content.trim();

//     let json;
//     try {
//       if (!output.startsWith("[")) throw new Error("Output not in JSON format");
//       json = JSON.parse(output);
//     } catch (err) {
//       return res.status(500).json({
//         msg: "Failed to parse GPT response as JSON.",
//         raw: output
//       });
//     }

//     // 🆕 Insert any new categories not in DB
//     const newCategories = json
//       .map(group => group.group_name)
//       .filter(name => !existingCategoryNames.includes(name));

//     for (const name of newCategories) {
//       await Category.create({ category_name: name });
//     }

//     return res.status(200).json(json);

//   } catch (error) {
//     console.error("GPT grouping failed:", error);
//     return res.status(500).json({ msg: "AI grouping failed", error: error.message });
//   }
// };








export const reportAnalysis = async (req, res) => {
  const { data } = req.body;

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: "Invalid or empty data array" });
  }

  const prompt = `
You are a professional Data analyst.

Here is a JSON array of grouped issues with their counts:

${JSON.stringify(data, null, 2)}

Write a short and professional summary (3–5 sentences) explaining:
- The most common issue categories
- Rare or low-frequency categories
- Any notable trends or insights

Be concise and helpful.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }]
    });

    const analysis = response.choices[0].message.content.trim();
    res.json({ analysis });
  } catch (err) {
    console.error("OpenAI analysis error:", err.message);
    res.status(500).json({ error: "AI analysis failed", details: err.message });
  }
};
