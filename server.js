const express = require('express');

const server = express();
server.use(express.json());

const projects = [];//Array local de projetos
let numberReqs = 0;

//Middlewares
server.use((req, res, next) => {
  numberReqs++;
  console.log(`Requisições: ${numberReqs}`);

  next();

});

function projectExist (req, res, next){
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if(!project){
    return res.status(400).json({ error: "ID does not exists" });
  }
  next();
};

//LIsta todos os projetos
server.get('/projects', (req, res) => {
  return res.send(projects);  
});

//Salva os projetos
server.post('/projects', (req,res) =>{
  const { id , title  } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.send(projects);

});

//Edita o titulo do projeto
server.put('/projects/:id' , projectExist, (req , res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);

});

//Apaga o projeto existente
server.delete('/projects/:id' , projectExist, (req , res) => {
  const { id } = req.params;
  //const project = projects.find(p => p.id == id);

  //projects.splice(project, 1);
  const index = projects.findIndex(p => p.id == id);

  projects.splice(index, 1);

  return res.send();

});

//POST - Tarefas
server.post('/projects/:id/tasks', projectExist, (req,res) =>{
  const { id  } = req.params;
  const { title  } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.send(projects);

});

server.listen(3000);