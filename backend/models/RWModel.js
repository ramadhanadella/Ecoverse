import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const RW = db.define(
  "rw",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.ENUM(
        "RW 1",
        "RW 2",
        "RW 3",
        "RW 4",
        "RW 5",
        "RW 6",
        "RW 7",
        "RW 8",
        "RW 9",
        "RW 10"
      ),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

export default RW;
