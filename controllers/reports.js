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


/* ============================================================================
 *  WHO Health IQ — 6-Month automated report endpoints
 *  Added for the Python DOCX report generator. All endpoints filter by the
 *  Issue.startDate column per project requirement. Issues with a null
 *  startDate are excluded from date-ranged results.
 * ========================================================================== */

import Organizations from "../models/organization_model.js";
import Categories from "../models/category_model.js";
import Solutions from "../models/solution_model.js";
import Users from "../models/user_model.js";
import { fn, col, literal } from "sequelize";

// Build a Sequelize where-clause for an optional [from, to] date range on
// startDate. If either bound is missing it is simply left off.
const buildDateRangeWhere = (from, to) => {
  const where = {};
  if (from || to) {
    const range = {};
    if (from) range[Op.gte] = dayjs(from).startOf("day").toDate();
    if (to)   range[Op.lte] = dayjs(to).endOf("day").toDate();
    where.startDate = range;
  }
  return where;
};


// GET /reports/summary?from=YYYY-MM-DD&to=YYYY-MM-DD
// Totals, plus breakdowns by severity / category / indicator / responsibility
// / role_in_the_organization. (Status breakdown intentionally omitted.)
export const reportSummary = async (req, res) => {
  try {
    const { from, to } = req.query;
    const where = buildDateRangeWhere(from, to);

    const total = await Issue.count({ where });

    const bySeverity = await Issue.findAll({
      attributes: ["severity", [fn("COUNT", col("id")), "count"]],
      where,
      group: ["severity"],
      order: [[fn("COUNT", col("id")), "DESC"]],
      raw: true
    });

    const byCategory = await Issue.findAll({
      attributes: [
        [col("category.category_name"), "category_name"],
        [fn("COUNT", col("issues.id")), "count"]
      ],
      include: [{ model: Categories, attributes: [] }],
      where,
      group: ["category.id", "category.category_name"],
      order: [[fn("COUNT", col("issues.id")), "DESC"]],
      raw: true
    });

    // Indicator analysis: group by indicator_code + related_to_indicators
    // (description). Only issues actually linked to an indicator are counted.
    const byIndicator = await Issue.findAll({
      attributes: [
        "indicator_code",
        "related_to_indicators",
        [fn("COUNT", col("id")), "count"]
      ],
      where: {
        ...where,
        indicator_code: { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: "" }] }
      },
      group: ["indicator_code", "related_to_indicators"],
      order: [[fn("COUNT", col("id")), "DESC"]],
      raw: true
    });

    // Count issues that are NOT tied to any indicator (null or empty code).
    const issuesWithoutIndicator = await Issue.count({
      where: {
        ...where,
        [Op.or]: [
          { indicator_code: null },
          { indicator_code: "" }
        ]
      }
    });

    // Filter for indicator-related issues (used twice below).
    const indicatorRelatedWhere = {
      ...where,
      indicator_code: { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: "" }] }
    };

    // Severity distribution within the indicator-related subset.
    const indicatorSeverity = await Issue.findAll({
      attributes: ["severity", [fn("COUNT", col("id")), "count"]],
      where: indicatorRelatedWhere,
      group: ["severity"],
      order: [[fn("COUNT", col("id")), "DESC"]],
      raw: true
    });

    // Responsibility distribution within the indicator-related subset.
    const indicatorResponsibility = await Issue.findAll({
      attributes: ["responsibility", [fn("COUNT", col("id")), "count"]],
      where: indicatorRelatedWhere,
      group: ["responsibility"],
      order: [[fn("COUNT", col("id")), "DESC"]],
      raw: true
    });

    // Responsibility analysis: who carries responsibility for the issue.
    const byResponsibility = await Issue.findAll({
      attributes: [
        "responsibility",
        [fn("COUNT", col("id")), "count"]
      ],
      where,
      group: ["responsibility"],
      order: [[fn("COUNT", col("id")), "DESC"]],
      raw: true
    });

    // Role-in-organization of the person who reported the issue.
    const byRole = await Issue.findAll({
      attributes: [
        "role_in_the_organization",
        [fn("COUNT", col("id")), "count"]
      ],
      where,
      group: ["role_in_the_organization"],
      order: [[fn("COUNT", col("id")), "DESC"]],
      raw: true
    });

    return res.status(200).json({
      range: {
        from: from || null,
        to: to || null
      },
      total_issues: total,
      by_severity: bySeverity,
      by_category: byCategory,
      by_indicator: byIndicator,
      issues_without_indicator: issuesWithoutIndicator,
      indicator_severity: indicatorSeverity,
      indicator_responsibility: indicatorResponsibility,
      by_responsibility: byResponsibility,
      by_role: byRole
    });
  } catch (error) {
    console.error("reportSummary error:", error);
    return res.status(500).json({ msg: error.message });
  }
};


// GET /reports/by-organization?from=YYYY-MM-DD&to=YYYY-MM-DD
// Per-organization totals + severity breakdown. (Status intentionally omitted.)
export const reportByOrganization = async (req, res) => {
  try {
    const { from, to } = req.query;
    const where = buildDateRangeWhere(from, to);

    const totals = await Issue.findAll({
      attributes: [
        "organizations_id",
        [col("organization.name"), "organization_name"],
        [fn("COUNT", col("issues.id")), "count"]
      ],
      include: [{ model: Organizations, attributes: [] }],
      where,
      group: ["organizations_id", "organization.id", "organization.name"],
      order: [[fn("COUNT", col("issues.id")), "DESC"]],
      raw: true
    });

    const byOrgSeverity = await Issue.findAll({
      attributes: [
        "organizations_id",
        "severity",
        [fn("COUNT", col("id")), "count"]
      ],
      where,
      group: ["organizations_id", "severity"],
      raw: true
    });

    // Stitch the result sets into one array keyed by organization.
    const index = new Map();
    for (const row of totals) {
      index.set(row.organizations_id, {
        organizations_id: row.organizations_id,
        organization_name: row.organization_name,
        total: Number(row.count),
        by_severity: {}
      });
    }
    for (const row of byOrgSeverity) {
      const entry = index.get(row.organizations_id);
      if (entry) entry.by_severity[row.severity || "unspecified"] = Number(row.count);
    }

    return res.status(200).json({
      range: { from: from || null, to: to || null },
      organizations: Array.from(index.values())
    });
  } catch (error) {
    console.error("reportByOrganization error:", error);
    return res.status(500).json({ msg: error.message });
  }
};


// GET /reports/trends?months=6
// Monthly issue counts for the last N months (inclusive of current).
// Bucketed by startDate. Issues with null startDate are excluded.
export const reportTrends = async (req, res) => {
  try {
    const months = Math.max(1, Math.min(36, parseInt(req.query.months, 10) || 6));
    const start = dayjs().subtract(months - 1, "month").startOf("month").toDate();

    const rows = await Issue.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("startDate"), "%Y-%m"), "month"],
        [fn("COUNT", col("id")), "count"]
      ],
      where: {
        startDate: { [Op.gte]: start, [Op.ne]: null }
      },
      group: [literal("month")],
      order: [[literal("month"), "ASC"]],
      raw: true
    });

    // Backfill months that had zero issues so the chart has a continuous x-axis.
    const series = [];
    const byMonth = Object.fromEntries(rows.map(r => [r.month, Number(r.count)]));
    for (let i = 0; i < months; i++) {
      const m = dayjs(start).add(i, "month").format("YYYY-MM");
      series.push({ month: m, count: byMonth[m] || 0 });
    }

    return res.status(200).json({
      months,
      from: dayjs(start).format("YYYY-MM-DD"),
      to: dayjs().format("YYYY-MM-DD"),
      series
    });
  } catch (error) {
    console.error("reportTrends error:", error);
    return res.status(500).json({ msg: error.message });
  }
};


// GET /reports/full-export?from=YYYY-MM-DD&to=YYYY-MM-DD
// Flat JSON array of issues with joined org / category / solution / user names,
// intended for the "Raw data appendix" table in the DOCX report.
// Filtered and ordered by startDate.
export const reportFullExport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const where = buildDateRangeWhere(from, to);

    const rows = await Issue.findAll({
      where,
      include: [
        { model: Organizations, attributes: ["id", "name"] },
        { model: Categories,    attributes: ["id", "category_name"] },
        { model: Solutions,     attributes: ["id", "solution_title"] },
        { model: Users,         attributes: ["id", "name", "email"] }
      ],
      order: [["startDate", "DESC"]]
    });

    // Flatten nested assoc objects into a single-level record per issue.
    const flat = rows.map(r => {
      const v = r.get({ plain: true });
      return {
        id: v.id,
        description: v.description,
        impact: v.impact,
        responsibility: v.responsibility,
        status: v.status,
        severity: v.severity,
        assigned_to: v.assigned_to,
        started_by: v.started_by,
        role_in_the_organization: v.role_in_the_organization,
        related_to_indicators: v.related_to_indicators,
        indicator_code: v.indicator_code,
        keywords: v.keywords,
        startDate: v.startDate,
        endDate: v.endDate,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
        organization_id: v.organization ? v.organization.id : v.organizations_id,
        organization_name: v.organization ? v.organization.name : null,
        category_id: v.category ? v.category.id : v.category_id,
        category_name: v.category ? v.category.category_name : null,
        solution_id: v.solution ? v.solution.id : v.solution_id,
        solution_title: v.solution ? v.solution.solution_title : null,
        user_id: v.user ? v.user.id : v.user_id,
        user_name: v.user ? v.user.name : null,
        user_email: v.user ? v.user.email : null
      };
    });

    return res.status(200).json({
      range: { from: from || null, to: to || null },
      count: flat.length,
      issues: flat
    });
  } catch (error) {
    console.error("reportFullExport error:", error);
    return res.status(500).json({ msg: error.message });
  }
};
