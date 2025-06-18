import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Organizations from "./organization_model.js";

const { DataTypes } = Sequelize;

const Issues = db.define("issues", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    description: {
        type: DataTypes.TEXT
    },
    priority: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    },
    completed_by: {
        type: DataTypes.STRING
    },
    started_by: {
        type: DataTypes.STRING
    },
    petitioner_name: {
        type: DataTypes.STRING
    },
    contact_type: {
        type: DataTypes.STRING
    },
    contact_value: {
        type: DataTypes.STRING
    },
    related_to_indicators: {
        type: DataTypes.STRING
    },
    indicator_code: {
        type: DataTypes.STRING
    },
    organizations_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Organizations,
            key: "id"
        },
        allowNull: false
    }
}, {
    freezeTableName: true
});

// Define association
Organizations.hasMany(Issues, { foreignKey: "organizations_id" });
Issues.belongsTo(Organizations, { foreignKey: "organizations_id" });

// Issues.belongsToMany(Indicators, {
//     through: IndicatorsHasIssues,
//     foreignKey: "issues_id",
//     otherKey: "indicators_id"
// });

export default Issues;
