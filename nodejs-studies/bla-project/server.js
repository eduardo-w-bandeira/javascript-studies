// const express = require('express');
import express from 'express';

const PORT = 3000;

// Create an instance of Express
const app = express();


app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});


app.get("/users", (req, res) => {
  res.send(["user1", "user2", "user3"]);
});

app.get(
  "/users/:id",
  (req, res, next) => {
      console.log("CUSTOM MIDDLE WARE");
      next();
  },
  (req, res) => {
      res.send("user1");
  }
);

// Start the server and listen on port 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
