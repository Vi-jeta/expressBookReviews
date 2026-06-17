const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

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

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn] ? books[isbn] : { message: "Book not found" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matches = Object.values(books).filter(b => b.author === author);
  res.send(matches);
});

// Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matches = Object.values(books).filter(b => b.title === title);
  res.send(matches);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn] ? books[isbn].reviews : { message: "Book not found" });
});

// ---------- Task 10-13: Same data, fetched via Axios using async/await and Promises ----------

// Task 10: Get all books – using async/await with Axios
async function getAllBooks() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log("All books:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all books:", error.message);
  }
}

// Task 11: Search by ISBN – using Promise callbacks with Axios
function getBookByISBN(isbn) {
  return axios.get(`${BASE_URL}/isbn/${isbn}`)
    .then(response => {
      console.log(`Book with ISBN ${isbn}:`, response.data);
      return response.data;
    })
    .catch(error => {
      console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
    });
}

// Task 12: Search by Author – using async/await with Axios
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    console.log(`Books by ${author}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching books by author ${author}:`, error.message);
  }
}

// Task 13: Search by Title – using async/await with Axios
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    console.log(`Books with title ${title}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching books with title ${title}:`, error.message);
  }
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;