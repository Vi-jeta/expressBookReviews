const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn] ? books[isbn] : { message: "Book not found" });
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matches = Object.values(books).filter(b => b.author === author);
  res.send(matches);
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matches = Object.values(books).filter(b => b.title === title);
  res.send(matches);
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn] ? books[isbn].reviews : { message: "Book not found" });
});

module.exports.general = public_users;