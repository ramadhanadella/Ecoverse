import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Sampah from "./SampahModel.js";
import RW from "./RWModel.js";

const { DataTypes } = Sequelize;

const Setor = db.define(
  "setor",
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
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    unit: {
      type: DataTypes.STRING,
      defaultValue: "0 kg",
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    sampahId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    rwId: {
      type: DataTypes.INTEGER,
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

Users.hasMany(Setor);
Setor.belongsTo(Users, { foreignKey: "userId" });

Sampah.hasMany(Setor);
Setor.belongsTo(Sampah, { foreignKey: "sampahId" });

RW.hasMany(Setor);
Setor.belongsTo(RW, { foreignKey: "rwId" });

export default Setor;
