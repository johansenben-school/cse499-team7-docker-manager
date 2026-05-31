const Docker = require("dockerode");
const docker = new Docker({
  socketPath: "/var/run/docker.sock",
});

const getContainers = async () => {
  try {
    return await docker.listContainers({ all: true });
  } catch (err) {
    console.error(err);
    return [];
  }
}
const getContainerById = async (id) => {
  try {
    const container = docker.getContainer(id);
    return await container.inspect();
  } catch (err) {
    console.error("error:", err);
    returnData = null;
  }
}

const containerList = async (req, res) => {
  //res.send("todo: container list page " + JSON.stringify(await getContainers()));
  res.render("dashboard/container-list", {
    title: "Containers",
    layout: "dashboard/layout",
    containers: await getContainers(),
    activePage: "containers"
  });
}
const container = async (req, res) => {
  res.send("todo: individual container page " + JSON.stringify(await getContainerById(req.params.id)));
}

module.exports = {
  containerList,
  container
}