// const express = require('express');
// const router = express.Router();
// const Author = require('../models/author')
// const Book = require('../models/book')

const imageContainer = document.querySelector('.imageContainer')
console.log(imageContainer);
// const requirejs=require('requirejs')
// const Author = require('../../models/author')
//  const Book = require('../../models/book')
const coverImagePath=document.querySelector('.onhovertitle')



imageContainer.addEventListener('onmouseover', async function (e) {
    try {
            e.preventDefault();
            const imgdata=coverImagePath.getAttribute('src')
            console.log(imgdata);
            
    }catch{

    }
})
