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

module.exports = router;
