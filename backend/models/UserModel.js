import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import RW from "./RWModel.js";

const { DataTypes } = Sequelize;

const Users = db.define(
  "users",
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
    nip: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "koor", "pekerja", "visitor"),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    rwId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

RW.hasMany(Users, { foreignKey: "rwId" });
Users.belongsTo(RW, { foreignKey: "rwId" });

export default Users;
