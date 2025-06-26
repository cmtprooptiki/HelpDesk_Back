import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Organizations from "./organization_model.js";
import Users from "./user_model.js"; // Assuming you have a Users model
import Categories from "./category_model.js"; // Assuming you have a Categories model
import Solutions from "./solution_model.js"; // Assuming you have a Solutions model

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
    severity:
    {
        type: DataTypes.STRING
    },
    assigned_to: {
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
    },
    keywords: {
    type: DataTypes.STRING // comma-separated, e.g., "vpn,remote_access,error"
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Users,
            key: "id"
        },
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Categories,
            key: "id"
        },
        allowNull: false
    },
    solution_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Solutions,
            key: "id"
        },
        allowNull: true
    },
}, {
    freezeTableName: true
});

// Define association
Organizations.hasMany(Issues, { foreignKey: "organizations_id" });
Issues.belongsTo(Organizations, { foreignKey: "organizations_id" });
Users.hasMany(Issues, { foreignKey: "user_id" });
Issues.belongsTo(Users, { foreignKey: "user_id" });
Categories.hasMany(Issues, { foreignKey: "category_id" });
Issues.belongsTo(Categories, { foreignKey: "category_id" });
Solutions.hasMany(Issues, { foreignKey: "solution_id" });
Issues.belongsTo(Solutions, { foreignKey: "solution_id" });

export default Issues;
