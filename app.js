require("dotenv").config();
const express = require("express");
const app = express();
const port = 3001;
const userRouter = require("./routes/userRoutes");
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use("/", userRouter);

app.listen(port, (error) => {
  if (error) {
    console.error(`Error occurred while starting the server: ${error}`);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});