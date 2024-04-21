const mongoose = require('mongoose');

// Country Schema
const countrySchema = new mongoose.Schema({
    name: String,
    countryId: Number
});

// City Schema
const citySchema = new mongoose.Schema({
    name: String,
    province: String,
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' }
});

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' }
});

// Author Schema
const authorSchema = new mongoose.Schema({
    name: String,
    // One author => multiple books
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});

// Book Schema
const bookSchema = new mongoose.Schema({
    name: String,
    genre: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// models
const Country = mongoose.model('Country', countrySchema);
const City = mongoose.model('City', citySchema);
const User = mongoose.model('User', userSchema);
const Author = mongoose.model('Author', authorSchema);
const Book = mongoose.model('Book', bookSchema);

// Assuming you have already established a connection to MongoDB
mongoose.connect('mongodb://localhost:27017/nestedDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

// Assuming you have some data in the database already
// This part might vary based on your application logic

// Now, when you want to find a book and populate all nested levels
Book.findOne({}).populate({
    path: 'user',
    populate: {
        path: 'city',
        populate: {
            path: 'country'
        }
    },
    populate: 'author' // Populate author
}).exec((err, book) => {
    if (err) {
        console.error(err);
    } else {
        console.log(book);
    }
});
