/** BizTime express application. */


const express = require("express");

const app = express();
const ExpressError = require("./expressError")
const companyRoutes = require("./routes/companies");
const invRoutes = require("./routes/invoices");

const { allowedNodeEnvironmentFlags } = require("process");

app.use(express.json());

app.use('/companies', companyRoutes);

app.use('/invoice', invRoutes);


/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
