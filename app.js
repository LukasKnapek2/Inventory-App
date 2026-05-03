require("dotenv").config();
const express = require("express");
const pool = require("./db/pool");
const app = express();
const PORT = process.env.PORT || 3001;
const allSkinsRouter = require("./routes/allSkinsRouter");
const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const caseRoutes = require("./routes/caseRoutes");
const path = require("path");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const { requireAuth } = require("./middleware/requireAuth");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),

    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use("/", allSkinsRouter);
app.use("/auth", authRoutes);
app.use("/inventory", requireAuth, inventoryRoutes);
app.use("/case", requireAuth, caseRoutes);



app.listen(PORT, (error) => {
  if (error) {
    console.error(`Error occurred while starting the server: ${error}`);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
