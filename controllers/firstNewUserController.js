const { createUser } = require("../database/users");
const firstNewUser = (req, res) => {
  res.render("first-new-user", {
    title: "Create New Admin",
    layout: "layout"
  });
}
const firstNewUserPost = async (req, res) => {
  const { username, password, passwordConfirmation } = req.body;
  if (username && password === passwordConfirmation){
    await createUser(username, password, true);
  }
  res.redirect("/login");
}

module.exports = {
  firstNewUser,
  firstNewUserPost
}