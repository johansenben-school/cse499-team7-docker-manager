const express = require("express");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const db = require('./database/database');
const { getUser } = require("./database/users");

//********** init **********
const app = express();
const PORT = 3000;



//********** middleware **********
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);

// Serve static files (CSS, images, client-side JS) from the 'public' folder
app.use(express.static("public")); 

app.set("view engine", "ejs");

//********** routes **********
app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
    layout: "layout"
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  res.send(`login post: username: ${username}, password: ${password}`); //todo
});

app.get("/first-new-user", (req, res) => {
  res.render("first-new-user", {
    title: "Create New Admin",
    layout: "layout"
  });
});

app.post("/first-new-user", (req, res) => {
  const { username, password, passwordConfirmation } = req.body;
  res.send(`login post: username: ${username}, password: ${password}, password confirmation: ${passwordConfirmation}`); //todo
});

//********** start **********
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Docker Manager server running on port ${PORT}`);
});