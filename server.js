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
  secret: process.env.SESSION_SECRET ?? "SESSION_SECRET", // session secret probably shouldnt have a default value
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

// === WEEK 5 SPRINT 3: Eric's Profile Routing Extensions ===

// GET Route: Renders the user details page with active session data
app.get("/user/details", requireLogin, (req, res) => {
    res.render("user-details", { 
        title: "Profile Details", 
        user: req.session.user 
    });
});

// POST Route: Processes the profile form update data
app.post("/user/update", requireLogin, async (req, res) => {
    const { username, email, newPassword, confirmNewPassword } = req.body;
    
    try {
        // Validate password match if a new password was provided
        if (newPassword && newPassword !== confirmNewPassword) {
            return res.status(400).send("New passwords do not match.");
        }

        // Update the active session data memory so the views immediately show the modifications
        if (req.session.user) {
            req.session.user.username = username;
            req.session.user.email = email;
        }

        // Redirect back to the profile details page to show the fresh updates safely
        res.redirect("/user/details");
    } catch (error) {
        console.error("Profile update failed:", error);
        res.status(500).send("Error updating profile data.");
    }
});

//********** start **********
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Docker Manager server running on port ${PORT}`);
});