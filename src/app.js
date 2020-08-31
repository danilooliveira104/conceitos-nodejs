const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);
  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = repositories.findIndex(repositoryIndex => repositoryIndex.id == id);

  if(repository < 0){
    return response.status(400).json({ Error: 'This repository does not exist' });
  }

  const newData = {
    id,
    title,
    url,
    techs,
    likes: repositories[repository].likes,
  };

  repositories[repository] = newData;

  return response.json(repositories[repository]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repository = repositories.findIndex(repositoryIndex => repositoryIndex.id == id);

  if(repository < 0){
    return response.status(400).json({Error: "This repository does not exist"});
  }

  repositories.splice(repository, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.findIndex(repositoryIndex => repositoryIndex.id == id);

  if(repository < 0){
    return response.status(400).json({Error: "This repository does not exist"});
  }

  repositories[repository].likes++;
  return response.json(repositories[repository]); 
});

module.exports = app;
