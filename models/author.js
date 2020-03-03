//we need mongoose
const mongoose = require('mongoose');
const Book = require('./book')

//in sql we have tables, but in mongoose we have schema, which is just json objects
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
})
// mongoose has a function pre, which performs any thing before the operation
//here if we delete author, so we want to remove the book also 
//before removing author, the book will removed, hence we use remove.
authorSchema.pre('remove', function (next) {
    Book.find({ author: this.id }, (err, books) => {
        if (err) {
            next(err)
        }
        else if (books.length > 0) {
            next(new Error('This author has books still'));
        }
        else {
            next()
        }
    })
})
//exporting the model, so we can use it in rest of our application.
module.exports = mongoose.model('Author', authorSchema)