const express = require("express");
const Level = require("../models/levelSchema");
const levelRouter = express.Router();

levelRouter
  .route("/")
  .get((req, res, next) => {
    Level.find()
      .then((levels) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(levels);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Level.create(req.body)
      .then((level) => {
        console.log("level Created ", level);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(level);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /levels");
  })
  .delete((req, res, next) => {
    Level.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

levelRouter
  .route("/:levelId")
  .get((req, res, next) => {
    Level.findById(req.params.levelId)
      .then((level) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(level);
      })
      .catch((err) => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /levels/${req.params.levelId}`);
  })
  .put((req, res, next) => {
    Level.findByIdAndUpdate(
      req.params.levelId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((level) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(level);
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Level.findByIdAndDelete(req.params.levelId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = levelRouter;
