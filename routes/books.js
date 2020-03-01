// We need express
const express = require('express');

//getting router function from Router() from express.
const router = express.Router();

//importing book model from models
const Book = require('../models/book')

//importing author model from models
const Author = require('../models/author')

//importing multer library for file upload
const multer = require('multer')

//importing file system inbuilt library of nodejs
const fs = require('fs')
//importing path from nodejs library 
const path = require('path')
const uploadPath = path.join('public', Book.coverImageBasePath)

//image types
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//importing multer library for file upload
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }

})
//All Books Route

router.get('/', async (req, res) => {
  let query = Book.find()
  //for title search
  if ((req.query.title != null) && (req.query.title) != '') {
    query=query.regex('title',new RegExp(req.query.title.trim(),'i'))
  }
  //creating filters for searching based on date 
                //lte stands for less than equal to..and 
                //gte for greater than equal to
                //for publishedBefore search
                if ((req.query.publishedBefore != null) && (req.query.publishedBefore) != '') {
                query=query.lte('publishedDate',req.query.publishedBefore)  
                }
                //for publishedAfter search
                if ((req.query.publishedAfter != null) && (req.query.publishedAfter) != '') {
                  query=query.gte('publishedDate',req.query.publishedAfter)  
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





  // const query = Book.find()
  // if (req.query.title != null && req.query.title != '') {
  //   query = query.regex('title', new RegExp(req.query.title, 'i'))
  // }
  // try {
  //   const books = await Book.find({})
  //   res.render('books/index', {
  //     books: books,
  //     searchOptions: req.query
  //   })
  // }
  // catch(err){
  //   res.redirect('/')
  //   console.error(err)
  // }

})


//New Book Route
router.get('/new', async (req, res) => {
  // res.render('books/new',{book: new Book(), author: new Author()})
  //creating a function which render pages
  renderNewPage(res, new Book())

})

//Create Book Route
router.post('/', upload.single('cover'), async (req, res) => {
  const filename = ((req.file) != null ? (req.file.filename) : null)
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: req.body.publishDate,
    pageCount: req.body.pageCount,
    coverImageName: filename,
    description: req.body.description,
  })

  try {
    const newBook = await book.save()
    // res.redirect(`books/${newBook.id}`)
    res.redirect('books')
  } catch{
    //we observe if we get error, while creating book, the boook cover is getting saved in public/uploads/bookCover
    //function to remove book cover we use fs inbuilt library
    if (book.coverImageName != null) {
      removeBookCover(book.coverImageName)
    }
    renderNewPage(res, book, true)
  }
})
//function to remove coverImage which is saved when book is not entered due to some error
function removeBookCover(filename) {
  fs.unlink(path.join(uploadPath, filename), err => {
    if (err) console.error(err)
  })
}


//function to render oage everytime 
async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if (hasError) params.errorMessage = 'Error Creating Book'
    res.render('books/new', params)
  } catch (error) {
    res.redirect('/books')
  }
}



module.exports = router;