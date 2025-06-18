import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Issues from "./issue_model.js";
import Indicators from "./indicators_model.js";

const { DataTypes } = Sequelize;

const IndicatorsHasIssues = db.define("indicators_has_issues", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    freezeTableName: true,
    timestamps: false
});

// Define associations here
// Issues.belongsToMany(Indicators, {
//     through: IndicatorsHasIssues,
//     foreignKey: "issues_id",
//     otherKey: "indicators_id"
// });

// Indicators.belongsToMany(Issues, {
//     through: IndicatorsHasIssues,
//     foreignKey: "indicators_id",
//     otherKey: "issues_id"
// });
IndicatorsHasIssues.belongsTo(Issues, { foreignKey: 'issues_id' });
IndicatorsHasIssues.belongsTo(Indicators,{foreignKey:'indicators_id'})

export default IndicatorsHasIssues;
