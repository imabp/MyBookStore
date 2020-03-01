//we need mongoose
const mongoose=require('mongoose');
const coverImageBasePath='uploads/bookCovers'
const path=require('path');
//in sql we have tables, but in mongoose we have schema, which is just json objects
const bookSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    publishDate:{
        type: Date,
        required:true
    },
    pageCount:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    coverImageName:{
        type:String,
        required:true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, //referencing another object inside our collection
        required:true,
        ref:'Author'
    }
})
//creating virtual property
//for info about mongoose virtuals, use this documentation.
//https://mongoosejs.com/docs/tutorials/virtuals.html
bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName!=null)
    {
        return path.join('/',coverImageBasePath, this.coverImageName)
    }
})

//exporting the model, so we can use it in rest of our application.
module.exports=mongoose.model('Book',bookSchema)
module.exports.coverImageBasePath=coverImageBasePath;