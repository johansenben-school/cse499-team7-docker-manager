const userDetails = (req, res) => {
  res.render("user-details", {
    title: "User Details",
    layout: "dashboard/layout",
    activePage: "user-details"
  });
}

module.exports = {
  userDetails
}