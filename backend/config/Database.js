import { Sequelize } from "sequelize";

const db = new Sequelize("ecoverse_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
