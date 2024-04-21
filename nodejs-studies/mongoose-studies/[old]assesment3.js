import express from "express";
import mongoose from 'mongoose';

const URI = 'mongodb://127.0.0.1:27017';
const PORT = 3000;

const app = express();

app.listen(PORT, async () => {
    console.log(`Listening on PORT ${PORT}`);

    await mongoose.connect(URI);
    console.log("Mongoose connection opened");
});


// SCHEMAS

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number }
});

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});


// MODELS
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

// Write a sample CRUD Operation for each model

// USER
// Create a new user
const john = new User({ name: "John", email: "john@gmail.com", age: 28 });
await john.save();
const ralph = new User({ name: "Ralph", email: "ralph@gmail.com", age: 29 });
await ralph.save();

// Retrieve a user by ID
const allUsers = User.find();
const user = await User.findById(allUsers[0]._id);

// Update user information
user.name = "UpdatedName";
user.email = "updatedemail@gmail.com";
user.age = 30;
await user.save();

// Delete a user
await ralph.remove();

// POST
// Create a new post
const post = new Post({
    title: "Post Title",
    content: "Text text text",
    author: user._id
});
await post.save();

const post2 = new Post({
    title: "Title 2",
    content: "Text2 text2 text2",
    author: user._id
});
await post2.save();


// Retrieve all posts
const posts = await Post.find();

// Retrieve posts by a specific author
const postsByAuthor = await Post.find({ author: user._id });

// Update a post
post.content = "Updated content";

// Delete a post
post2.remove()

// POST
// Create a new comment on a post
const comment = new Comment({
    text: "Comment comment comment",
    author: user._id,
    post: post._id
});
await comment.save();

const comment2 = new Comment({
    text: "Comment 2",
    author: user._id,
    post: post._id
});

// Retrieve all comments on a post
const comments = await Comment.find({ post: post._id });

// Update a comment
comment.text = "Updated comment";

// Delete a comment
comment2.remove();


// POPULATION:
// How would you populate the author field in a retrieved post document?
const populatedPost = await Post.findById(post._id).populate('author');

// How would you populate the author field for all posts retrieved?
const populatedPosts = await Post.find().populate('author');

// How would you populate the author field and post field for all the comments retrieved?
const populatedComments = await Comment.find().populate('author').populate('post');


// AGGREGATION

// How would you aggregate the total number of posts per user?
const numberOfPostsPerUser = await Post.aggregate([
    {
        $group: {
            _id: '$author',
            totalPosts: { $sum: 1 }
        }
    }
]);

// How would you find the user(s) with the most comments?
const userWithMostComments = await Comment.aggregate([
    {
        $group: {
            _id: '$author',
            totalComments: { $sum: 1 }
        }
    },
    {
        $sort: { totalComments: -1 }
    },
    {
        $limit: 1
    }
]);

// How would you find the most active users based on the total number of posts and comments they have made combined?
const mostActiveUsers = await User.aggregate([
    {
        $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'author',
            as: 'posts'
        }
    },
    {
        $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'author',
            as: 'comments'
        }
    },
    {
        $project: {
            _id: 1,
            name: 1,
            totalPosts: { $size: '$posts' },
            totalComments: { $size: '$comments' }
        }
    },
    {
        $addFields: {
            totalActivities: { $add: ['$totalPosts', '$totalComments'] }
        }
    },
    {
        $sort: { totalActivities: -1 }
    }
]);

// How would you calculate the average length of posts (in terms of character count) for each user?
const averageLengthPostsPerUser = await Post.aggregate([
    {
        $group: {
            _id: '$author',
            averagePostLength: { $avg: { $strLenCP: '$content' } }
        }
    }
]);

// How would you find the most common words used across all post titles? Hint: Similar to DISTINCT keyword, use addToSet
const mostCommonWords = await Post.aggregate([
    {
        $project: {
            _id: 0,
            titleWords: { $split: ["$title", " "] }
        }
    },
    {
        $unwind: "$titleWords"
    },
    {
        $group: {
            _id: null,
            commonWords: { $addToSet: "$titleWords" }
        }
    },
    {
        $unwind: "$commonWords"
    },
    {
        $group: {
            _id: "$commonWords",
            count: { $sum: 1 }
        }
    },
    {
        $sort: { count: -1 }
    }
]);


// Can you identify users who have not made any posts or comments?
const usersWithNoPostOrComment = await User.aggregate([
    {
        $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'author',
            as: 'posts'
        }
    },
    {
        $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'author',
            as: 'comments'
        }
    },
    {
        $match: {
            $and: [
                { posts: { $exists: false } },
                { comments: { $exists: false } }
            ]
        }
    }
]);


// How would you find the posts that have been inactive for a certain period (e.g., no comments or updates in the last month)?
const inactiveUsers = await Post.aggregate([
    {
        $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'post',
            as: 'comments'
        }
    },
    {
        $addFields: {
            lastActivityDate: {
                $max: [
                    { $ifNull: [{ $max: '$comments.createdAt' }, '$updatedAt'] },
                    '$createdAt'
                ]
            }
        }
    },
    {
        $match: {
            lastActivityDate: {
                $lt: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) // Filter posts inactive for the last 30 days
            }
        }
    }
]);

// How would you group posts by their publication year and calculate the average number of comments per post for each year?
const result = await Post.aggregate([
    {
        $project: {
            year: { $year: '$createdAt' },
            commentsCount: { $size: '$comments' }
        }
    },
    {
        $group: {
            _id: '$year',
            totalComments: { $sum: '$commentsCount' },
            totalPosts: { $sum: 1 }
        }
    },
    {
        $project: {
            _id: 0,
            year: '$_id',
            averageCommentsPerPost: { $divide: ['$totalComments', '$totalPosts'] }
        }
    },
    {
        $sort: { year: 1 }
    }
]);