// We need express
const express = require('express');

//getting router function from Router() from express.
const router = express.Router();

//importing author model from models
const Author = require('../models/author')

//All Authors Route

router.get('/', async (req, res) => {
    //this is for searching author
    let searchOptions = {};
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name.trim(), 'i')
    }

    //this is for loading list of authors already in database
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { authors: authors, 
                                      searchOptions: req.query })
    } catch{
        red.redirect('/')
    }
})


//New Author Route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

//Create Author Route
//We have so many callbacks and if else stuff... we prefer to use async await. and try catch block
router.post('/', async (req, res) => {
    const author = new Author({
        // we are explicitly telling server which parameter to take
        //if user enters ID parameter then it would be difficult for server to resolve
        name: req.body.name
    })

    try {

        const newAuthor = await author.save()
        res.redirect(`authors`)
        //res.redirect(`authors/${newAuthor.id}`)
    }
    catch{
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error Creating Author'
        })
    }


    // author.save((err, newAuthor) => {
    //     if (err) {
    //         res.render('authors/new', {
    //             author: author,
    //             errorMessage: 'Error Creating Author'
    //         })
    //         console.log(err)
    //     }
    //     else {
    //         // res.redirect(`authors/${newAuthor.id}`)
    //          res.redirect(`authors`)
    //          }
    // })

})


module.exports = router;