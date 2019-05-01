const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sequelize = require("./models").sequelize;
const express = require('express');
// const book = require("./models").Book;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/static', express.static('public'));
app.set('view engine', 'pug');

//setting routes
app.get('/',(req,res,next)=>{
	res.redirect('/books');
});

const bookRoutes = require('./routes/books');
app.use('/books',bookRoutes);

//error handling
app.use((req,res,next)=>{
	const err = new Error('You got lost but it serves you right...');
	err.status = 404;
	next(err);
});

app.use((err,req,res,next)=>{
	res.locals.error = err;
	res.status(err.status);
	res.render('page-not-found');
});


// server start, app listens on PORT 3000
sequelize.sync().then(function(){
	app.listen(3000,()=>{ console.log('App is running on port 3000')});
});


// module.exports = app;


