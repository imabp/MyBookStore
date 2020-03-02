//we need mongoose
const mongoose = require('mongoose');
//*************************************************** */
// use when you are using server instead of filepond
// const coverImageBasePath = 'uploads/bookCovers'
// const path = require('path');
//************************************************** */
//in sql we have tables, but in mongoose we have schema, which is just json objects
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    // use this when you are using multer locally
    // coverImageName:{
    //     type:String,
    //     required:true
    // },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, //referencing another object inside our collection
        required: true,
        ref: 'Author'
    }
})
//creating virtual property
//for info about mongoose virtuals, use this documentation.
//https://mongoosejs.com/docs/tutorials/virtuals.html
bookSchema.virtual('coverImagePath').get(function () {
    if (this.coverImage != null && this.coverImageType!=null) {
        // we will cover Image name as data buffer in template string
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

//exporting the model, so we can use it in rest of our application.
module.exports = mongoose.model('Book', bookSchema)