require("dotenv").config();
const express = require("express");
const app = express();
const port = 3001;
const allSkinsRouter = require("./routes/allSkinsRouter");
const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const caseRoutes = require("./routes/caseRoutes");
const path = require("path");
const session = require("express-session");
const { requireAuth } = require("./middleware/requireAuth");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use("/", allSkinsRouter);
app.use("/auth", authRoutes);
app.use("/inventory", requireAuth, inventoryRoutes);
app.use("/case", requireAuth, caseRoutes);

app.listen(port, (error) => {
  if (error) {
    console.error(`Error occurred while starting the server: ${error}`);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
