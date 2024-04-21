import express from "express";
import mongoose from 'mongoose';
const Schema = mongoose.Schema

const URI = 'mongodb://127.0.0.1:27017';
const PORT = 3000;

const app = express();

app.listen(PORT, async () => {
    console.log(`Listening on PORT ${PORT}`);

    await mongoose.connect(URI);
    console.log("Mongoose connection opened");
});



// Country Schema
const countrySchema = new Schema({
    name: String,
    countryId: Number
});

// City Schema
const citySchema = new Schema({
    name: String,
    province: String,
    country: {
        type: Schema.Types.ObjectId,
        ref: 'Country'
    }
});

// User Schema
const userSchema = new Schema({
    name: String,
    age: Number,
    email: String,
    city: {
        type: Schema.Types.ObjectId,
        ref: 'City'
    }
});

// Book Schema
const bookSchema = new Schema({
    name: String,
    genre: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});


// Models
const Book = mongoose.model('Book', bookSchema);
const User = mongoose.model('User', userSchema);
const City = mongoose.model('City', citySchema);
const Country = mongoose.model('Country', countrySchema);

//  Deep Population
const booksPopulated = await Book.find({})
    .populate({
        path: 'user',
        populate: {
            path: 'city',
            populate: { path: 'country' }
        }
    }).exec();
