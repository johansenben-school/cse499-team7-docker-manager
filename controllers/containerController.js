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
const getContainerDataById = async (id) => {
  try {
    return (await docker.listContainers({ all: true, filters: JSON.stringify({id: [id]}) }))[0];
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

const containerList = async (req, res) => {
  res.render("dashboard/container-list", {
    title: "Containers",
    layout: "dashboard/layout",
    containers: await getContainers(),
    activePage: "containers"
  });
}
const container = async (req, res) => {
  const id = req.params.id;
  const containerData = await getContainerDataById(id);
  const container = await getContainerById(id);
  if (!container) {
    return res.redirect("/containers")
  }
  res.render("dashboard/container", {
    title: "Container - " + id,
    layout: "dashboard/layout",
    containerData,
    container,
    activePage: "containers",
    id
  });
}

const startContainerPost = async (req, res) => {
  const id = req.params.id;
  if (!id)
    return res.redirect("/containers");
  try {
    const container = docker.getContainer(id);
    await container.start();
  } catch (err) {
    console.error(err);
  }
  return res.redirect("/containers");
}
const stopContainerPost = async (req, res) => {
  const id = req.params.id;
  if (!id)
    return res.redirect("/containers");
  try {
    const container = docker.getContainer(id);
    await container.stop();
  } catch (err) {
    console.error(err);
  }
  return res.redirect("/containers");
}
const deleteContainerPost = async (req, res) => {
  const id = req.params.id;
  if (!id)
    return res.redirect("/containers");
  try {
    const container = docker.getContainer(id);
    await container.remove();
  } catch (err) {
    console.error(err);
  }
  return res.redirect("/containers");
}

module.exports = {
  containerList,
  container,
  startContainerPost,
  stopContainerPost,
  deleteContainerPost
}