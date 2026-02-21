import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME || "ecoverse_db",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
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
