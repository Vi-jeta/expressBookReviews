const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password){
        if(!isValid(username)){
            users.push({"username":username,"password":password});
            return res.status(200).json({message:"User successfully registered. Now you can login"});
        }
        return res.status(404).json({message:"User already exists!"});
    }
    return res.status(404).json({message:"Unable to register user."});
});

// Get all books using async/await
public_users.get('/', async function (req, res) {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
});

// Get book by ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    axios.get('http://localhost:5000/')
    .then(response => {
        return res.status(200).json(response.data[isbn]);
    })
    .catch(err => {
        return res.status(500).json({message: err.message});
    });
});

// Get books by author using async/await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    const response = await axios.get('http://localhost:5000/');
    const booksData = response.data;

    const result = Object.values(booksData).filter(
        book => book.author === author
    );

    return res.status(200).json(result);
});

// Get books by title using Promises
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    axios.get('http://localhost:5000/')
    .then(response => {
        const result = Object.values(response.data).filter(
            book => book.title === title
        );
        return res.status(200).json(result);
    })
    .catch(err => {
        return res.status(500).json({message: err.message});
    });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
