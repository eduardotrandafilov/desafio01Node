const express = require("express");

const server = express();

server.use(express.json());

let numberOfRequests = 0;
const projects = [];

/**
 * Middleware que dá log no número de requisições
 */

function logRequests(req, res, next) {
  numberOfRequests++;
  console.log(`Número de requisições:${numberOfRequests}`);
  return next();
}

server.use(logRequests);

/**
 * Middleware que checa se o projeto existe
 */

function checkProject(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ message: "Project not found" });
  }

  return next();
}

/**
 * Projects
 */

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

server.put("/projects/:id", checkProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProject, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(p => p.id == id);

  projects.splice(index, 1);

  return res.send();
});

/**
 * Tasks
 */

server.post("/projects/:id/tasks", checkProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(4000);
