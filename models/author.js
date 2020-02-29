//we need mongoose
const mongoose=require('mongoose');


//in sql we have tables, but in mongoose we have schema, which is just json objects
const authorSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
})

//exporting the model, so we can use it in rest of our application.
module.exports=mongoose.model('Author',authorSchema)