const express = require("express");
const levelRouter = express.Router();

levelRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end("Will send all the levels to you");
  })
  .post((req, res) => {
    res.end(
      `Will add the level: ${req.body.name} with description: ${req.body.description}`
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /levels");
  })
  .delete((req, res) => {
    res.end("Deleting all levels");
  });

module.exports = levelRouter;
