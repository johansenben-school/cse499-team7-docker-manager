require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const db = require('./database/database');
const { getUser, getUserFromLogin, createUser, updateUser } = require("./database/users");
const session = require("express-session");
const { requireLogin, requireNotLoggedIn, newFirstUserIfNoUsers, requireNoUsers, requireAdmin } = require("./middleware/auth");
const { login, loginPost, logout } = require("./controllers/loginController");
const { firstNewUser, firstNewUserPost } = require("./controllers/firstNewUserController");
const { dashboard } = require("./controllers/dashboardController");

const { containerList, container, startContainerPost, stopContainerPost, deleteContainerPost } = require("./controllers/containerController");
const { userDetails } = require("./controllers/userController");

// UPDATED IMPORT: Added createUserView and createUserPost
const { userDetails, createUserView, createUserPost } = require("./controllers/userController");


//********** init **********
const app = express();
const PORT = 3000;

//********** middleware **********
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);

app.use(session({
  secret: process.env.SESSION_SECRET ?? "SESSION_SECRET",
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

app.get("/containers", requireLogin, containerList);
app.get("/container/:id", requireLogin, container);

app.post("/container/start/:id", requireLogin, requireAdmin((req,res) => res.status(401).send("admin required")), startContainerPost);
app.post("/container/stop/:id", requireLogin, requireAdmin((req,res) => res.status(401).send("admin required")), stopContainerPost);
app.post("/container/delete/:id", requireLogin, requireAdmin((req,res) => res.status(401).send("admin required")), deleteContainerPost);

// === WEEK 5 SPRINT 3: Eric's Profile Routing Extensions ===

// GET Route: Renders the user details page
app.get("/user/details", requireLogin, userDetails);

// POST Route: Processes the profile form update data
app.post("/user/update", requireLogin, async (req, res) => {
    const { username, email, newPassword, confirmNewPassword } = req.body;
    try {
        if (newPassword && newPassword !== confirmNewPassword) {
            return res.status(400).send("New passwords do not match.");
        }
        if (req.session.username) {
            let success = await updateUser(req.session.username, username, email, newPassword);
            if (!success) throw new Error("updateUser failure");
            req.session.username = username;
            req.session.email = email;
        }
        res.redirect("/user/details");
    } catch (error) {
        console.error("Profile update failed:", error);
        res.status(500).send("Error updating profile data.");
    }
});

// === WEEK 6 SPRINT 4: Eric's Create User Routing ===
app.get("/create-user", requireLogin, createUserView);
app.post("/create-user", requireLogin, createUserPost);

//********** start **********
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Docker Manager server running on port ${PORT}`);
});