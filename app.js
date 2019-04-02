var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
var exercise = require("./model").exercise;

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/exercise-log");

var db = mongoose.connection;

db.on("error", function(err) {
  console.error("connection error: ", err);
});

db.once("open", function() {
  console.log("Connected to MongoDb");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");

app.use(express.static("public"));
//app.use('/static',express.static('/public'));
//app.use('/static', express.static(path.join(__dirname, 'public')))

app.get("/", function(req, res) {
  //  res.sendFile(path.join(__dirname, 'views', 'index.html'));
  res.render("index", { savefeedback: " " });
});

app.post("/", function(req, res) {
  var name = req.body.newUserName;

  exercise.findOne({ username: name }, function(err, item) {
    if (err) {
      res.json({ error: err });
    }

    if (item && item != "") {
      res.status(201);
      res.setHeader("content-type", "text/html");
      res.render("index", { savefeedback: "user already exists." });
    } else {
      //save
      var newUser = new exercise({ username: name });

      newUser.save(function(err, item) {
        if (err) {
          res.status(401);
          res.json({ error: err });
        } else {
          // res.json({"username": item.username, "status":"New user saved."});
          res.render("index", {
            savefeedback: "new username saved. Click Add Exercise."
          });
        }
      });
    } //end else
  });
});

app.get("/api/exercise/add", function(req, res) {
  res.render("exercise");
});

app.post("/api/exercise/add", function(req, res) {
  var name = req.body.user;
  var exType = req.body.description;
  var exDuration = req.body.duration;
  var exDate = req.body.date;

  exercise.findOne({ username: name }, function(err, item) {
    if (err) {
      res.json({ error: err });
    }

    if (item) {
      var newExercise = {
        description: exType,
        duration: exDuration,
        date: exDate
      };
      exercise.update(
        { username: name },
        { $push: { exercises: newExercise } },
        function(err, item) {
          if (err) {
            res.status(401);
            res.json({ error: err });
          } else {
            res.status(201);
            res.render("exercise", { exFeedback: "exercise saved" });
          }
        }
      );
    } else {
      res.render("exercise", { exFeedback: "user not found" });
    }
  });
});

app.get("/api/exercise/log", function(req, res) {
  var name = req.params.returnuser;

  if (name) {
    res.render("log", { logFeedback: name });
  } else {
    res.render("log", { logFeedback: "User" });
  }
});

app.post("/api/exercise/log", function(req, res) {
  var name = req.body.returnuser;
  var noExercises = [
    { description: "No exercises found", duration: "N/A", date: "N/A" }
  ];

  exercise.findOne({ username: name }, function(err, item) {
    if (err) {
      res.json({ error: err });
    }

    if (item && item.exercises.length !== 0) {
      var exerciseLogList = item.exercises;

      res.status(200);
      res.render("log", { logFeedback: name, exerciseList: exerciseLogList });
    } else if (item && item.exercises.length === 0) {
      res.status(200);
      res.render("log", { logFeedback: name, exerciseList: noExercises });
    } else {
      res.render("log", {
        logFeedback: "Unfound User",
        exerciseList: noExercises
      });
    }
  });
});

module.exports = app;
