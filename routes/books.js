const Book = require('../models').Book;
const express = require('express');
const router = express.Router();
const Op = require('sequelize').Op;
const limit = 10;
let pageNum = 0;

// display all books
router.get('/', (rq, rs) => {
	Book.findAndCountAll({ order: [['createdAt', 'DESC']], limit})
		.then(books => {
			pageNum = Math.ceil(books.count/limit);
			rs.render('index', { books: books.rows, page : pageNum});
		})
		.catch(err => {
			rs.send(500, err);
		});
});

// display book creation form
router.get('/new', (rq, rs) => {
	rs.render('new-book');
});

// insert a book into table
router.post('/new', (rq, rs) => {
	let book = {
		title: rq.body.title,
		author: rq.body.author,
		genre: rq.body.genre,
		year: rq.body.year
	};
	// check if the book is already in the table
	Book.findOne({ where: book })
		.then(bk => {
			if (bk) {
				//display errors that book is already in the table
				rs.render('new-book', {
					book: bk,
					err: ['This book already exists in the database']
				});
			} else {
				// create a new book
				Book.create(book)
					.then(newBook => {
						rs.redirect('/books');
					})
					.catch(err => {
						// can not save
						if (err.name === 'SequelizeValidationError') {
							rs.render('new-book', {
								book: Book.build(rq.body),
								err: err.errors
							});
						} else {
							next(err);
						}
					})
					.catch(err => {
						rs.send(500, err);
					});
			}
		})
		.catch(err => {
			rs.send(500, err);
		});
});

//search function
router.get('/search', (rq, rs) => {
	var query = rq.query.search;
	if(query){
		Book.findAndCountAll({
			order: [['createdAt', 'DESC']],
			limit,
			where: {
				[Op.or]: [
					{
						title: {
							[Op.like]: `%${query}%`
						}
					},
					{
						author: {
							[Op.like]: `%${query}%`
						}
					},
					{
						genre: {
							[Op.like]: `%${query}%`
						}
					},
					{
						year: {
							[Op.like]: `%${query}%`
						}
					}
				]
			}
		}).then(books => {
			if (books.rows && books.rows.length > 0) {
				pageNum = Math.ceil(books.count / limit);
				rs.render('index', { books: books.rows, page: pageNum });
			} else {
				rs.render('index', { books: books, err: ['No record'] });
			}
		})
			.catch(err => {
				rs.send(500, err);
			});
	}else{
		rs.redirect('/books');
	}
	
});

//pagination function
router.get('/page/:n',(rq,rs)=>{
	let offset = (parseInt(rq.params.n) * limit);
	Book.findAndCountAll({ order: [['createdAt', 'DESC']], limit , offset})
		.then(books => {
			pageNum = Math.ceil(books.count / limit);
			rs.render('index', { books: books.rows, page: pageNum });
		})
		.catch(err => {
			rs.send(500, err);
		});
})

// display book detail
router.get('/:id', (rq, rs) => {
	Book.findByPk(rq.params.id)
		.then(book => {
			if (book) {
				rs.render('update-book', { book: book });
			} else {
				// book not found
				rs.render('page-not-found');
			}
		})
		.catch(err => {
			rs.send(500, err);
		});
});

//update book
router.post('/:id', (rq, rs) => {
	Book.findByPk(rq.params.id)
		.then(book => {
			if (book) {
				return book.update(rq.body);
			} else {
				//err
				rs.render('update-book', {
					err: ['Book not found, could not update the book.']
				});
			}
		})
		.then(() => {
			rs.redirect('/books');
		})
		.catch(err => {
			if (err.name === 'SequelizeValidationError') {
				rq.body.id=rq.params.id;
				rs.render('update-book', {
					book: Book.build(rq.body),
					err: err.errors
				});
			} else {
				next(err);
			}
		})
		.catch(err => {
			rs.send(500, err);
		});
	
});
// delete selected book
router.post('/:id/delete', (rq, rs) => {
	Book.findByPk(rq.params.id)
		.then(book => {
			if (book) {
				book.destroy();
				rs.redirect('/books');
			} else {
				//err
				rs.render('page-not-found');
			}
		})
		.catch(err => {
			rs.send(500, err);
		});
});

module.exports = router;
