const dashboard = (req, res) => {
  res.render("dashboard/home", {
    title: "Dashboard",
    layout: "dashboard/layout",
    activePage: "dashboard-home"
  });
}

module.exports = {
  dashboard
}