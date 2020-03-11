//jshint esversion:6
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017//userDB", {useNewUrlParser: true});


app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});





app.listen(3000, function(){
  console.log("server is runnoing on port 3000");
});
