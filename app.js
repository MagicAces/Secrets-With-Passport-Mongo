//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
// const encrypt = require("mongoose-encryption");
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// userSchema.plugin(encrypt, {secret: process.env.SECRET_KEY, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save()
        .then(() => res.render("secrets"))
        .catch((err) => res.send(err));
        
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    User.findOne({email: req.body.username})
        .then(user => {
            if(user)
                user.password === md5(req.body.password) ? res.render("secrets") : res.redirect("/login");
            else
                res.redirect("/login");
        })
        .catch(err => res.send(err));
})

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});