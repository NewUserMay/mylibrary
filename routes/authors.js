const express = require("express")
const Router = express.Router()
const Author = require("../models/authors")


//All Authors Route
Router.get("/" , async (req , res) => {

    let SearchOptions = {}
    if(req.query.name != null && req.query.name !== ''){
        SearchOptions.name = new RegExp(req.query.name , "i")
    }
   try{
    const authors = await Author.find(SearchOptions)
    res.render("authors/index" , {authors: authors ,
        SearchOptions: req.query
    })

   }catch{
    res.redirect("/")
   }
})

//New Author Route
Router.get("/new" , (req , res) => {
    res.render('authors/new' , {author : new Author()})
})

Router.post("/", (req , res) => {
    const author = new Author({
        name : req.body.name
    })


    author.save().then((newAuthor) => {
            // res.redirect(`authors/${newAuthor.id}`)
            res.redirect("authors")
    }).catch((err) => {
        res.render("authors/new" , {
            author: author,
            errorMessage: 'Error creating Author'
        })
    })
    
})

module.exports = Router