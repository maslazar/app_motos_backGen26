const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

//Controllers
const globalErrorHandler = require("./controllers/error.controller");

//Routes-rutas
const userRoute = require("./routes/user.route");
const repairRoute = require("./routes/repair.route");
const AppError = require("./utils/appError");

const app = express();

app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/users", userRoute);
app.use("/api/v1/repairs", repairRoute);

app.all("*", (req, res, next) => {
  return next(
    new AppError(`The url ${req.originalUrl} not found in this server`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
