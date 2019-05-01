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
	rs.render('new-book');
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
			rs.render('new-book',{book:bk, err:["This book already exists in the database"] });
		}else{
			// create a new book
			Book.create(book).then(newBook => {
				rs.redirect('/books');
			}).catch(err=>{
				// can not save
				if (err.name ==='SequelizeValidationError'){
					rs.render('new-book',{
						book: Book.build(rq.body),
						err: err.errors
					});
				}else{
					next(err);
				}

			}).catch(err=>{
				rs.send(500, err);
			});
		}
	}).catch(err => {
		rs.send(500, err)
	});
});

// display book detail
router.get('/:id',(rq,rs)=>{
	Book.findByPk(rq.params.id).then(book => {
		if(book){
			rs.render('update-book', { book: book });
		}else{
			// book not found
			rs.render('page-not-found');
		}
	}).catch(err=>{
		rs.send(500,err);
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
			rs.render('update-book',{err:['Book not found, could not update the book.']});
		}
	}).then(()=>{
		rs.redirect('/books');
	}).catch(err=>{
		if (err.name === 'SequelizeValidationError'){
			rs.render('update-book', {
				book: Book.build(rq.body),
				err: err.errors
			});
		}else{
			next(err);
		}
	}).catch(err=>{
		rs.send(500, err);
	});
})
// delete selected book
router.post('/:id/delete',(rq,rs)=>{
	Book.findByPk(rq.params.id).then(book => {
		if(book){
			book.destroy();
			rs.redirect('/books');
		}else{
			//err
			rs.render('page-not-found');
		}
	}).catch(err => {
		rs.send(500,err);
	})
})

module.exports = router;
