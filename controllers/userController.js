const { createUser } = require("../database/users");

const userDetails = (req, res) => {
  res.render("user-details", {
    title: "User Details",
    layout: "dashboard/layout",
    activePage: "user-details"
  });
}

// Updated for Sprint 4: Passes error messages to the view template
const createUserView = (req, res) => {
  // Grab the error message from session memory if it exists, then clear it
  const error = req.session.errorMessage || null;
  req.session.errorMessage = null; 

  res.render("dashboard/create-user", {
    title: "Create User",
    layout: "dashboard/layout",
    activePage: "create-user",
    error: error // Makes the 'error' variable available in create-user.ejs
  });
}

// Updated for Sprint 4: Validates form submission inputs
const createUserPost = async (req, res) => {
    try {
        const { username, password, isAdmin } = req.body;
        
        // Form Validation: Check if inputs are missing
        if (!username || !password) {
            req.session.errorMessage = "Username and password are required fields.";
            return res.redirect("/create-user");
        }
        
        // Call the database utility function
        await createUser(username, password, isAdmin === 'true');
        
        console.log("Successfully created user:", username);
        res.redirect("/dashboard");
    } catch (error) {
        console.error("User creation failed:", error);
        req.session.errorMessage = "Database error: Could not create user.";
        res.redirect("/create-user");
    }
}

module.exports = {
  userDetails,
  createUserView,
  createUserPost
}