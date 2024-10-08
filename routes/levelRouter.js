const express = require("express");
const Level = require("../models/levelSchema");
const authenticate = require("../authenticate");

const levelRouter = express.Router();

levelRouter
  .route("/")
  .get((req, res, next) => {
    Level.find()
      .populate("feedbacks.author")
      .then((levels) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(levels);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Level.create(req.body)
      .then((level) => {
        console.log("Level Created ", level);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(level);
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /levels");
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
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
      .populate("feedbacks.author")
      .then((level) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(level);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /levels/${req.params.levelId}`
    );
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Level.findByIdAndDelete(req.params.levelId)
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

levelRouter
  .route("/:levelId/feedbacks")
  .get((req, res, next) => {
    Level.findById(req.params.levelId)
      .populate("feedbacks.author")
      .then((level) => {
        if (level) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(level.feedbacks);
        } else {
          err = new Error(`Level ${req.params.levelId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Level.findById(req.params.levelId)
      .then((level) => {
        if (level) {
          req.body.author = req.user._id;
          level.feedbacks.push(req.body);
          level
            .save()
            .then((level) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(level);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Level ${req.params.levelId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /levels/${req.params.levelId}/feedbacks`
    );
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Level.findById(req.params.levelId)
        .then((level) => {
          if (level) {
            for (let i = level.feedbacks.length - 1; i >= 0; i--) {
              level.feedbacks.id(level.feedbacks[i]._id).deleteOne();
            }
            level
              .save()
              .then((level) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(level);
              })
              .catch((err) => next(err));
          } else {
            err = new Error(`Level ${req.params.levelId} not found`);
            err.status = 404;
            return next(err);
          }
        })
        .catch((err) => next(err));
    }
  );

levelRouter
  .route("/:levelId/feedbacks/:feedbackId")
  .get((req, res, next) => {
    Level.findById(req.params.levelId)
      .populate("feedbacks.author")
      .then((level) => {
        if (level && level.feedbacks.id(req.params.feedbackId)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(level.feedbacks.id(req.params.feedbackId));
        } else if (!level) {
          err = new Error(`Level ${req.params.levelId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Feedback ${req.params.feedbackId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /levels/${req.params.levelId}/feedbacks/${req.params.feedbackId}`
    );
  })

  .put(authenticate.verifyUser, (req, res, next) => {
    Level.findById(req.params.levelId)
      .then((level) => {
        if (level && level.feedbacks.id(req.params.feedbackId)) {
          if (
            level.feedbacks
              .id(req.params.feedbackId)
              .author._id.equals(req.user._id)
          ) {
            if (req.body.rating) {
              level.feedbacks.id(req.params.feedbackId).rating =
                req.body.rating;
            }
            if (req.body.text) {
              level.feedbacks.id(req.params.feedbackId).text = req.body.text;
            }
            level
              .save()
              .then((level) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(level);
              })
              .catch((err) => next(err));
          } else {
            err = new Error(`Not authorized`);
            err.status = 403;
            return next(err);
          }
        } else if (!level) {
          err = new Error(`Level ${req.params.levelId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Feedback ${req.params.feedbackId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Level.findById(req.params.levelId)
      .then((level) => {
        if (level && level.feedbacks.id(req.params.feedbackId)) {
          if (
            level.feedbacks
              .id(req.params.feedbackId)
              .author._id.equals(req.user._id)
          ) {
            level.feedbacks.id(req.params.feedbackId).deleteOne();
            level
              .save()
              .then((level) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(level);
              })
              .catch((err) => next(err));
          } else {
            err = new Error(`Not authorized`);
            err.status = 403;
            return next(err);
          }
        } else if (!level) {
          err = new Error(`Level ${req.params.levelId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Feedback ${req.params.feedbackId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

module.exports = levelRouter;

module.exports = levelRouter;
