// We need express
const express = require('express');
//NEVER EVER PUT CONSOLE.lOg(ERROR) in production environment
//getting router function from Router() from express.
const router = express.Router();

//importing author model from models
const Author = require('../models/author')
//importing book model from models

const Book = require('../models/book')
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
        if (authors != null) {
            res.render('authors/index', {
                authors: authors,
                searchOptions: req.query
            })
        }
        else {  
            res.render('authors/noAuthorERROR')
        }
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
        res.redirect(`authors/${newAuthor.id}`)
    }
    catch (error) {

        res.render('authors/new', {
            author: author,
            errorMessage: 'Error Creating Author'
        })
    }




})
// Delete Author
router.delete('/:id', async (req, res) => {
    let author;

    try {
        //finding author by id,if not found error 1 in catch
        author = await Author.findById(req.params.id)
        //we remove the author, if not removed we go to error 2 of catch 
        await author.remove()
        //we redirect the user to the authors page
        res.redirect(`/authors`)
    }
    catch (error) {
        if (author == null) {
            //error 1 if author doesnt exist, redirect to homepage

            res.redirect('/')
        } else {
            //error 2 if unable to remve, redirect to author page.

            res.redirect(`/authors/${author.id}`)
        }
    }
})
// Showing Author Route
router.get('/:id', async (req, res) => {
    try {
        //finding author by id
        const author = await Author.findById(req.params.id)
        //if author has huge number of boks, show 6 only
        const books = await Book.find({ author: author.id }).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch (error) {

        res.redirect('/')
    }




})

// Edit Author Route
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    } catch (error) {

        res.render('/authors')

    }

})
//******************************************KNOWLEDGE INFO BOX**************************************************************** */
//***        WE can just POST AND GET FROM Browser, therefore we install method-override library                            ** */
//***        npm i method-override                                                                                          ** */
//***        It takes in POST form and send it to server with a special parameter whether its put or delete request.        ** */
//***        then in server.js file we route it properly. m                                                                 ** */
//***                                                                                                 ** */
//*** ***************************************INFO BOX************************************************************************* */                                                                  ** */
//  Update Author Route  
router.put('/:id', async (req, res) => {
    let author;

    try {
        //finding author by id,if not found error 1 in catch
        author = await Author.findById(req.params.id)
        //after finding author we change its name
        author.name = req.body.name
        //we save the author, if not save then we go to error 2 of catch 
        await author.save()
        //we redirect the user to the authors page
        res.redirect(`/authors/${author.id}`)
    }
    catch{
        if (author == null) {
            //error 1 if author doesnt exist, redirect to homepage
            res.redirect('/')
        } else {
            //error 2 if unable to save, redirect to edit page only.
            res.render('/authors/edit', {
                author: author,
                errorMessage: 'Error Updating Author'
            })
        }
    }
})

//Router to Delete Author 


module.exports = router;

//******************************************KNOWLEDGE INFO BOX**************************************************************** */
//***        Always use delete method to delete any object                                                                  ** */
//***        Never Use get method to Delete any object because when google crawls through your website                      ** */
//***        it takes all the links having .get method and if there is any delete operation, it will delete everything      ** */
//***        I                                                                                                              ** */
//***                                                                                                                       ** */
//***                                                                                                                       ** */
//*** ***************************************INFO BOX************************************************************************* */                                                                  ** */
//  Update Author Route  