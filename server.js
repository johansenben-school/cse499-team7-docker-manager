require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const db = require('./database/database');
const { getUser, getUserFromLogin, createUser } = require("./database/users");
const session = require("express-session");
const { requireLogin, requireNotLoggedIn, newFirstUserIfNoUsers, requireNoUsers } = require("./middleware/auth");
const { login, loginPost, logout } = require("./controllers/loginController");


//********** init **********
const app = express();
const PORT = 3000;

//********** middleware **********
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);

app.use(session({
  secret: process.env.SESSION_SECRET ?? "SESSION_SECRET",//session secret probably shouldnt have a default value
  resave: false,
  saveUninitialized: false,
}));

// Serve static files (CSS, images, client-side JS) from the 'public' folder
app.use(express.static("public")); 

app.set("view engine", "ejs");

//********** routes **********
app.get("/login", requireNotLoggedIn, newFirstUserIfNoUsers, login);
app.post("/login", requireNotLoggedIn, loginPost);

app.get("/logout", logout);

app.get("/first-new-user", requireNotLoggedIn, requireNoUsers, (req, res) => {
  res.render("first-new-user", {
    title: "Create New Admin",
    layout: "layout"
  });
});

app.post("/first-new-user", requireNotLoggedIn, requireNoUsers, async (req, res) => {
  const { username, password, passwordConfirmation } = req.body;
  console.log(username,password,passwordConfirmation)
  //res.send(`login post: username: ${username}, password: ${password}, password confirmation: ${passwordConfirmation}`); //todo
  if (username && password === passwordConfirmation){console.log(123)
    await createUser(username, password, true);
  }
  res.redirect("/login");
});

app.get("/dashboard", requireLogin, (req, res) => {
  res.send("dashboard");
})

//********** start **********
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Docker Manager server running on port ${PORT}`);
});