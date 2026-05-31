require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const db = require('./database/database');
const { getUser, getUserFromLogin, createUser } = require("./database/users");
const session = require("express-session");
const { requireLogin, requireNotLoggedIn, newFirstUserIfNoUsers, requireNoUsers } = require("./middleware/auth");
const { login, loginPost, logout } = require("./controllers/loginController");
const { firstNewUser, firstNewUserPost } = require("./controllers/firstNewUserController");
const { dashboard } = require("./controllers/dashboardController");
const { containerList, container } = require("./controllers/containerController");
const { userDetails } = require("./controllers/userController");


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

app.get("/first-new-user", requireNotLoggedIn, requireNoUsers, firstNewUser);
app.post("/first-new-user", requireNotLoggedIn, requireNoUsers, firstNewUserPost);

app.get("/dashboard", requireLogin, dashboard);
app.get("/user/details", requireLogin, userDetails);

app.get("/containers", requireLogin, containerList);
app.get("/container/:id", requireLogin, container);

//********** start **********
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Docker Manager server running on port ${PORT}`);
});