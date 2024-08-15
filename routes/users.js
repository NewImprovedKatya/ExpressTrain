const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const authenticate = require("../authenticate");

const router = express.Router();

/* GET users listing. */
/* router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", async (req, res) => {
  try {

    const user = await new Promise((resolve, reject) => {
      User.register(
        new User({ username: req.body.username }),
        req.body.password,
        (err, user) => {
          if (err) reject(err);
          else resolve(user);
        }
      );
    });

    if (req.body.firstname) {
      user.firstname = req.body.firstname;
    }
    if (req.body.lastname) {
      user.lastname = req.body.lastname;
    }

    await new Promise((resolve, reject) => {
      user.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    passport.authenticate("local")(req, res, () => {
      res
        .status(200)
        .json({ success: true, status: "Registration Successful!" });
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}); */

router.post("/signup", async (req, res) => {
  try {
    // Register the user with username and password
    const user = new User({ username: req.body.username });
    const registeredUser = await User.register(user, req.body.password);

    // Update additional fields if provided
    if (req.body.firstname) {
      registeredUser.firstname = req.body.firstname;
    }
    if (req.body.lastname) {
      registeredUser.lastname = req.body.lastname;
    }

    // Save the user with the additional fields
    await registeredUser.save();

    // Authenticate the user
    passport.authenticate("local")(req, res, () => {
      res
        .status(200)
        .json({ success: true, status: "Registration Successful!" });
    });
  } catch (err) {
    // Handle errors
    res.status(500).json({ err });
  }
});

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: true,
      token: token,
      status: "You are successfully logged in!",
    });
  }
);

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    const err = new Error("You are not logged in!");
    err.status = 401;
    return next(err);
  }
});

module.exports = router;
