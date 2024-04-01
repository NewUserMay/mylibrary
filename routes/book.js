const express = require("express")
const Router = express.Router()
const Book = require("../models/book")
const Author = require("../models/authors")
const { trusted } = require("mongoose")
const imageMineTypes = ["image/png" , "image/jpeg" , "image/gif"]



Router.get("/" , async (req , res) => {
    let query = Book.find();
    if(req.query.title != null && req.query.title != ""){
        query = query.regex('title' , new RegExp(req.query.title , "i") )
    }

    if(req.query.publishedBefore != null && req.query.publishedBefore != ""){
        query = query.lte('publishDate' , req.query.publishedBefore )
    }

    if(req.query.publishedAfter != null && req.query.publishedAfter != ""){
        query = query.gte('publishDate' ,req.query.publishedAfter )
    }

    try{
        const books = await query.exec()

        res.render("books/index" , {
            books : books,
            SearchOptions  : req.query
        })

    }catch{
        res.redirect("/")
    }

})

Router.get("/new" , async (req , res) => {
    renderNewPage(res , new Book())
   })

Router.post("/" , async (req , res) => {
   const fileName = req.file != null ?  req.file.filename : null 
   console.log(req.file)
    const book = new Book({
        title : req.body.title,
        author : req.body.author,
        publishDate : new Date(req.body.publishDate),
        pageCount : req.body.pageCount,
        description : req.body.description,
        
    })

    
   try{
    saveCover(book , req.body.cover)
    const newBook = await book.save()
    res.redirect("books")
   }catch{
    renderNewPage(res , book , true)

   }
})

function saveCover(book , coverEncode){
    if(coverEncode == null) return
    const cover = JSON.parse(coverEncode)
    if(cover != null && imageMineTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data , 'base64')
        book.coverImageType = cover.type
    }
}


Router.get("/:id" , async(req , res) => {
    try{
        const book = await Book.findById(req.params.id).
        populate("author").exec()
        res.render("books/show" , {book : book})
    }catch{
        res.redirect("/")
    }
})

Router.get("/:id/edit" , async (req , res) => {

    try{

        const book = await Book.findById(req.params.id)
        renderEditPage(res , book )

    }catch{
        res.redirect("/")
    }

})


async function renderNewPage(res, book, hasError = false) {
    renderformPage(res, book, 'new', hasError)
  }
  
  async function renderEditPage(res, book, hasError = false) {
    renderformPage(res, book, 'edit', hasError)
  }


async function renderformPage (res , book , form , hasError=false){
    try{

        const authors = await Author.find({}) 

        const params = {
            authors : authors,
            book: book
        }

        if(hasError) {
            if(form === 'edit'){
                params.errorMessage = "Error Updating Book"
            }
        }
        res.render(`books/${form}`, params )
    }catch{

        res.redirect("/books")
    }
}

Router.put("/:id" , async (req , res) => {
    let book

    try{
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
       if(req.body.cover != null && req.body.cover !== ""){
        saveCover(body , req.body.cover)
       }
       await book.save();
       res.redirect(`/books/${book.id}`)
    }catch{
        if(book != null){
            renderEditPage(res , book , true)
        }
    }
})

Router.delete("/:id" , async (req , res) => {
    let book 
    try{

        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect("/books")

    }catch{
        if(book != null){
            res.render("books/show" , {
                book : book,
                errorMessage: "Could not remove book"
            })
        }else{
            res.redirect("/")
        }
    }
})

module.exports = Router