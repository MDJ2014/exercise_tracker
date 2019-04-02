'use strict'
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

const EXERCISE_SCHEMA= new Schema({
    username : String,
    exercises: [
        {
            description : String,
            duration: String,
            date: String,
            createdAt: { type: Date, default: Date.now }

        }
    ],
    
    createdAt: { type: Date, default: Date.now }
});


var exercise = mongoose.model("exercise", EXERCISE_SCHEMA);

module.exports.exercise = exercise;



