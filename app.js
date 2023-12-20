const express = require("express");
const app = express();
const path = require("path");
app.use(express.json());
const dbPath = path.join(__dirname, "todoApplication.db");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;
const initialization = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  app.listen(3000, () => {
    console.log("server running");
  });
};
initialization();
const priorityAndStatus = (query) => {
  return query.priority !== undefined && query.status !== undefined;
};
const priorityCheck = (query) => {
  return query.priority !== undefined;
};
const statusCheck = (query) => {
  return query.status !== undefined;
};
app.get("/todos/", async (request, response) => {
  const { search_q = "", priority, status } = request.query;
  let getTodoQuery = "";
  switch (true) {
    case priorityAndStatus(request.query):
      getTodoQuery = `SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND status = '${status}'
    AND priority = '${priority}'`;
      break;
    case priorityCheck(request.query):
      getTodoQuery = `select * from todo where todo like '%${search_q}%' and priority='%${priority}%'`;
      break;
    case statusCheck(request.query):
      getTodoQuery = `select * from todo where todo like '%${search_q}%' and status='${status}'`;
      break;
    default:
      getTodoQuery = `select * from todo where todo like '%${search_q}%'`;
      break;
  }
  //   console.log(status);
  //   const getTodoQuery = `select * from todo where status like "%upper(${status})%"`;
  const responseTodoQuery = await db.run(getTodoQuery);
  response.send(status);
});
app.get("/todos/", async (request, response) => {
  const { search_q = "", priority, status } = request.query;
  let getTodoQuery = `SELECT
    *
   FROM
    todo `;
  const responseTodoQuery = await db.run(getTodoQuery);
});
