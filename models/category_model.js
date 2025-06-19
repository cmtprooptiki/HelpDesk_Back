import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Categories = db.define("categories", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    freezeTableName: true
});

export default Categories;
