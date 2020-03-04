// We need express
const express = require('express');

//getting router function from Router() from express.
const router = express.Router();

//importing book model from models
const Book = require('../models/book')

//importing author model from models
const Author = require('../models/author')

//allowed image types
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//******************************************KNOWLEDGE INFO BOX***************************************************************************** */
//** ********** Use the following code when you are setting up a local server or Amazon S3 , I am using filepond js to avoid this.      *** */
//This part of code was written when I set up the server in my laptop only offline.                                                     *** */
//                                                                                                                                      *** */            
//                            //importing file system inbuilt library of nodejs                                                         *** */
//                            // const fs = require('fs')                                                                               *** */
//                            //importing path from nodejs library                                                                      *** */
//                            // const path = require('path')                                                                           *** */
//                            // const uploadPath = path.join('public', Book.coverImageBasePath)                                        *** */
//                                                                                                                                      *** */
//                            // *****USE MULTER WHEN YOU TOTALLY WANT TO DO THINGS ON FILE SYSTEM OR OFFLINE MODE, OR on AWS           *** */
//                            //I see, filepond is there for free, so using that, commenting this for users.                            *** */
//                            //importing multer library for file upload                                                                *** */
//                            //use multer if you are using it locally, without any internet thing                                      *** */
//                            // const multer = require('multer')                                                                       *** */
//                                                                                                                                      *** */
//                            //image types                                                                                             *** */
//                            // const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']                                        *** */
//                                                                                                                                      *** */
//                            // importing multer library for file upload                                                               *** */
//                            // const upload = multer({                                                                                *** */
//                            //   dest: uploadPath,                                                                                    *** */
//                            //   fileFilter: (req, file, callback) => {                                                               *** */
//                            //     callback(null, imageMimeTypes.includes(file.mimetype))                                             *** */
//                            //   }                                                                                                    *** */
//                                                                                                                                      *** */
//                            // })                                                                                                     *** */               
// *******************************************KNOWLEDGE INFO BOX END*********************************************************************** */



//All Books Route

router.get('/', async (req, res) => {
  let query = Book.find()
  //for title search
  if ((req.query.title != null) && (req.query.title) != '') {
    query = query.regex('title', new RegExp(req.query.title.trim(), 'i'))
  }
  //creating filters for searching based on date 
  //lte stands for less than equal to..and 
  //gte for greater than equal to
  //for publishedBefore search
  if ((req.query.publishedBefore != null) && (req.query.publishedBefore) != '') {
    query = query.lte('publishedDate', req.query.publishedBefore)
  }
  //for publishedAfter search
  if ((req.query.publishedAfter != null) && (req.query.publishedAfter) != '') {
    query = query.gte('publishedDate', req.query.publishedAfter)
  }

  try {
    const books = await query.exec();
    res.render('books/index', {
      books: books,
      searchOptions: req.query,
    })
  } catch{
    res.redirect('/')
  }






})


//New Book Route
router.get('/new', async (req, res) => {
  // res.render('books/new',{book: new Book(), author: new Author()})
  //creating a function which render pages
  renderFormPage(res, new Book(), 'new')

})

//Create Book Route add  "  upload.single('cover')  " to router.post if you are using multer.
router.post('/', async (req, res) => {
  // use this when you are using multer library.
  // const filename = ((req.file) != null ? (req.file.filename) : null)
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })
  saveCover(book, req.body.cover)

  //creating function for uploading the cover to filepond.js
  try {

    const newBook = await book.save()
    res.redirect(`books/${newBook.id}`)
    // res.redirect('books')
  }
  catch (error) {
    //********************************************KNOWLEDGE INFO BOX************************************************************************************ */
    //                                                                                                                                                ** */    
    //                              //***************IF YOU ARE USING MULTER USE THIS CODE TO CHECK COVER IMAGE NAME */                               ** */
    //                              //we observe if we get error, while creating book, the boook cover is getting saved in public/uploads/bookCover   ** */
    //                              //function to remove book cover we use fs inbuilt library                                                         ** */
    //                              // if (book.coverImageName != null) {                                                                             ** */
    //                              //   removeBookCover(book.coverImageName)                                                                         ** */
    //                              // }                                                                                                              ** */
    //                                                                                                                                                ** */ 
    //********************************************KNOWLEDGE INFO BOX************************************************************************************ */

    console.error(error);
    renderFormPage(res, book, 'new', true)
  }
})
//Router to show the book
router.get('/:id', async (req, res) => {
  try {
    //to populate with all author data
    const book = await Book.findById(req.params.id)
      .populate('author')
      .exec()
    res.render('books/show', { book: book })
  }
  catch (error) {
    res.redirect('/')
  }

})

//edit book route
router.get('/:id/edit', async (req, res) => {
  // res.render('books/new',{book: new Book(), author: new Author()})
  try {
    const book = await Book.findById(req.params.id)
    renderFormPage(res, book, 'edit')

  } catch (error) {
    console.log(error)
  }
})









//******************************************KNOWLEDGE INFO BOX***************************************************************************** */
//                                                                                                                                      *** */                                                                                
//                                                                                                                                      *** */
//IF YOU ARE USING MULTER, THEN USE THIS FUNCTION TO REMOVE COVERIMAGE                                                                  *** */
//                                                                                                                                      *** */                                                   
//function to remove coverImage which is saved when book is not entered due to some error                                               *** */
// function removeBookCover(filename) {                                                                                                 *** */
//   fs.unlink(path.join(uploadPath, filename), err => {                                                                                *** */
//     if (err) console.error(err)                                                                                                      *** */
//   })                                                                                                                                 *** */
// }                                                                                                                                    *** */
//                                                                                                                                      *** */
//******************************************KNOWLEDGE INFO BOX***************************************************************************** */





//Uddate Book Route 
router.put('/:id', async (req, res) => {

  let book;
  try {
    book = await Book.findById(req.params.id)
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate = new Date(req.body.publishDate)
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;

    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(book, req.body.cover)
    }
    await book.save()
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`/books/${book.id}`)
  }
  catch (error) {

    if (book != null) {
      console.log(error)
      renderFormPage(res, book, 'edit', true)
    } else {
      console.log(error)
      redirect('/')
    }
  }

})

//delete page
router.delete('/:id', async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id)
    await book.remove()
    res.redirect('/books')
  }
  catch (error) {
    if (book == null) {
res.redirect('/')
    }
    else {
      res.render('books/show', {
        book: book,
        errorMessage: 'Could Not Remove Book'
      })
    }
  }
})


// function to save cover
function saveCover(book, coverEncoded) {
  //if coverEncoded is nulll do nothing
  if (coverEncoded == null) {
    return
  }
  //else parsing coverEncoded into JSON.
  const cover = JSON.parse(coverEncoded)
  //check in order to avoid null values and do not accept the invalid type
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    //filepond takes base64 enco ded data
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}


//function to render Edit or New Page based on form parameter

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book,
    }
    if (hasError) {
      console.error(hasError)
      if (form === 'new') {
        params.errorMessage = 'Error Creating Book'
      }
      else {
        params.errorMessage = 'Error Updating Book'
      }
    }
    res.render(`books/${form}`, params)
  } catch (error) {
    console.error(error)
    res.redirect('/books')
  }
}











module.exports = router;