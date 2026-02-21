import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    // Tambahan untuk production biasanya butuh ini:
    dialectOptions:
      process.env.NODE_ENV === "production"
        ? {
            ssl: {
              rejectUnauthorized: false,
            },
          }
        : {},
  },
);

export default db;
