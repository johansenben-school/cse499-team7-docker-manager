const { getUserCount } = require("../database/users");

const requireLogin = (req, res, next) => {
  if (!req.session.username) {
    res.redirect("/login");
    return;
  }
  next();
}

const requireNotLoggedIn = (req, res, next) => {
  if (!req.session.username) {
    next();
    return;
  }
  res.redirect("/dashboard");
}

const newFirstUserIfNoUsers = async  (req, res, next) => {
  const userCount = await getUserCount();
  if (userCount == 0) {
    res.redirect("/first-new-user");
    return;
  }
  next();
}
const requireNoUsers = async (req, res, next) => {
  const userCount = await getUserCount();
  if (userCount !== 0) {
    res.redirect("/login");
    return;
  }
  next();
}

module.exports = {
  requireLogin,
  requireNotLoggedIn,
  newFirstUserIfNoUsers,
  requireNoUsers
}