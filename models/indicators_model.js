import { Sequelize } from "sequelize";
import db from "../config/database.js";
const { DataTypes } = Sequelize;

const Indicators = db.define("indicators", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});

// Indicators.belongsToMany(Issues, {
//     through: IndicatorsHasIssues,
//     foreignKey: "indicators_id",
//     otherKey: "issues_id"
// });

export default Indicators;
