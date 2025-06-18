import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Organizations = db.define("organizations", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING
    },
    postal_code: {
        type: DataTypes.STRING
    },
    phone_number: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true
        }
    },
    mobile_number: {
        type: DataTypes.STRING
    },
    website: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    freezeTableName: true
});

export default Organizations;
