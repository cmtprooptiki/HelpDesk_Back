import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Solutions = db.define("solutions", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    solution_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    solution_desc: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    freezeTableName: true
});

export default Solutions;
