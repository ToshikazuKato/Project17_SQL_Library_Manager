const Book = require('../models').Book;
const express = require('express');
const router = express.Router();

// display all books
router.get('/', (rq, rs) => {
	Book.findAll().then(books => {
			rs.render('index', { books: books });
		}).catch(err => {
			rs.send(500, err);
		});
});

// display book creation form
router.get('/new',(rq,rs)=>{
	rs.render('new_book');
});

// insert a book into table
router.post('/new',(rq,rs)=>{
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

// display book detail
router.get('/:id',(rq,rs)=>{
	Book.findByPk(rq.params.id).then(book => {
		rs.render('book_detail',{book:book});
	}).catch(err=>{
		console.log(err);
	});
});

//update book
router.post('/:id',(rq,rs)=>{
	Book.findByPk(rq.params.id).then(book => {
		if(book){
			console.log(rq.body);
			return book.update(rq.body);
		}else{
			//err
		}
	}).then(()=>{
		rs.redirect('/books');
	});
})



module.exports = router;
