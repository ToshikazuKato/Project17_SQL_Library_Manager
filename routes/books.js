const Book = require('../models').Book;
const express = require('express');
const router = express.Router();

router.get('/', (rq, rs) => {
	Book.findAll().then(books => {
			console.log(books);
			rs.render('index', { books: books });
		}).catch(err => {
			rs.send(500, err);
		});
});

router.get('/new',(rq,rs)=>{
	rs.render('new-book');
});

router.post('/new',(rq,rs)=>{
	// var title = rq.body.title;
	// var author = rq.body.author;
	// var genre = rq.body.genre;
	// var year = rq.body.year;
	 let book = {
		 'title' : rq.body.title,
		 'author' : rq.body.author,
		 'genre' : rq.body.genre,
		 'year' : rq.body.year,
	 };
	// check if the book is already in the table
	Book.findOne({where:book}).then(bk=>{
		if(bk){
			//display errors that book is already in the table
			//rs.render("new-book", { alert: "This book already exists in the shelf" });
		}else{
			// create a new book
			Book.create(book).then(newBook => {
				console.log(newBook+' is successfully registered');
				rs.redirect('/books');
			}).catch(err=>{
				console.log(err.errors);
			});
		}
	});


});

module.exports = router;
