const login = (req, res) => {
  res.render("login", {
    title: "Login",
    layout: "layout"
  });
}

const loginPost = async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserFromLogin(username, password);
  if (!user) {
    res.redirect("/login");//todo - show error message and refill the inputs with the previous 
    return;
  }
  req.session.username = username;
  req.session.isAdmin = user.isAdmin && true;
  res.redirect("/dashboard");
}

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json("Failed to delete session!");
    }
    res.redirect("/login");
  });
}

module.exports = {
  login,
  loginPost,
  logout
}