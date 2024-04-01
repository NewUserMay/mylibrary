const express = require("express")
const Router = express.Router()
const Author = require("../models/authors")
const Book = require("../models/book")




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


Router.get("/:id" , async (req , res) => {

   try{
    const author = await Author.findById(req.params.id)
    const books = await Book.find({author : author._id}).limit(6).exec()

    res.render('authors/show' , {
        author: author,
        booksByAuthor: books
    })
   }catch(e){
    console.log(e)
    res.redirect("/")
   }
})

Router.get("/:id/edit" , async (req , res) => {
    try{

        let author = await Author.findById(req.params.id)
        res.render('authors/edit' , {author : author})

    }catch{
        res.redirect("/authors")
    }
    
})



Router.put("/:id" , async (req , res) => {

    let author;

    try{

        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
      
        res.redirect(`/authors/${author.id}`)

    }catch{

        if(author == null){
            res.redirect("/")
        }else{
        res.render("authors/edit" , {
            author: author,
            errorMessage: 'Error updating Author'
            
        })
    }
    }
    
    
    
})

Router.delete("/:id" , async (req , res) => {
    let author;

    try{

        author = await Author.findById(req.params.id)
       await author.remove()
       
      
        res.redirect(`/authors`)

    }catch{

        if(author == null){
            res.redirect("/")
        }else{
     
        res.redirect(`/authors/${author.id}`)
    }
    }
    
    
    
})



module.exports = Router