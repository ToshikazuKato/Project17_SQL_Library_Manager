'use strict';
module.exports = (sequelize, DataTypes) => {
	const Book = sequelize.define(
		'Book',
		{
			title: {
				type:DataTypes.STRING,
				validate:{
					notEmpty: true,
				}
			},
			author: {
				type:DataTypes.STRING,
				validate:{
					notEmpty: true,
				}
			},
			genre: {
				type:DataTypes.STRING,
				validate:{
					notEmpty: true,
				}
			},
			year: {
				type:DataTypes.INTEGER,
				validate:{
					isNumeric: true,
				}
				
			}
		},
		{}
	);
	Book.associate = function(models) {
		// associations can be defined here
	};
	return Book;
};
