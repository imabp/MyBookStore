// We need express
const express = require('express');

//getting router function from Router() from express.
const router=express.Router();

router.get('/',(req,res)=>{
    res.render('index')
})


module.exports=router