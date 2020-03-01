// We need express, author, books
const express = require('express');
const Book = require('../models/book')
//getting router function from Router() from express.
const router = express.Router();

router.get('/', async (req, res) => {
    let books;

    try {
        //finding books and sorting them in descending order
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
        res.render('index', {
            books: books
        })
    } catch(err){
        books=[]
        console.error(err)
    }



    
})


module.exports = router