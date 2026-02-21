import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import SampahRoute from "./routes/SampahRoute.js";
import RwRoute from "./routes/RwRoute.js";
import SetorRoute from "./routes/SetorRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import LaporanRoute from "./routes/LaporanRoute.js";
dotenv.config();

const app = express();

app.set("trust proxy", 1);

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

(async () => {
  await db.sync();
  store.sync();
})();

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "http://localhost:3000",
      "https://ecoverse-2026.vercel.app",
    ],
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    proxy: true,
    cookie: {
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use(express.json());
app.use(AuthRoute);
app.use(UserRoute);
app.use(SampahRoute);
app.use(RwRoute);
app.use(SetorRoute);
app.use(LaporanRoute);

app.listen(process.env.APP_PORT, () => {
  console.log(`Server up and running...`);
});

app.get("/test", (req, res) => res.send("OK"));
