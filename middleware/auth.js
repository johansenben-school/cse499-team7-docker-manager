
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

module.exports = {
  requireLogin,
  requireNotLoggedIn
}