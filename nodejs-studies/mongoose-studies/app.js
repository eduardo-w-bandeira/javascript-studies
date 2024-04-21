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
    age: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});


// MODELS
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

// // Clear DB
// await User.deleteMany({});
// await Post.deleteMany({});
// await Comment.deleteMany({});

// Write a sample CRUD Operation for each model

// USER
// Create a new user
const john = new User({ name: "John", email: "john@gmail.com", age: 28 });
await john.save();
const ralph = new User({ name: "Ralph", email: "ralph@gmail.com", age: 29 });
await ralph.save();

// Retrieve a user by ID
const allUsers = await User.find();
const user = await User.findById(allUsers[0]._id);
console.log("Retrive user:", user, "\n");


// Update user information
user.name = "UpdatedName";
user.email = "updatedemail@gmail.com";
user.age = 30;
await user.save();
console.log("Upated:", user, "\n");

// Delete a user
await User.deleteOne({ _id: ralph._id });
console.log("Removed:", ralph, "\n");

// POST
// Create a new post
const post = new Post({
    title: "Post Title",
    content: "Text text text",
    author: user._id
});
await post.save();
console.log("Created post:", post, "\n");

const post2 = new Post({
    title: "Title 2",
    content: "Text2 text2 text2",
    author: user._id
});
await post2.save();


// Retrieve all posts
const posts = await Post.find();
console.log("Retrieve all posts:", posts, "\n");

// Retrieve posts by a specific author
const postsByAuthor = await Post.findOne({ author: user._id });
console.log("Retrieve posts by a specific author:", postsByAuthor, "\n");

// Update a post
post.content = "Updated content";
console.log("Update a post:", post, "\n");

// Delete a post
await Post.deleteOne({ _id: post2._id })
console.log("Deleted post:", post2, "\n");

const post3 = new Post({
    title: "Title 3",
    content: "Text3 text3 text3",
    author: user._id
});
await post3.save();


// POST
// Create a new comment on a post
const comment = new Comment({
    text: "Comment comment comment",
    author: user._id,
    post: post._id
});
await comment.save();
console.log("Create a new comment on a post:", comment, "\n");

const comment2 = new Comment({
    text: "Comment 2",
    author: user._id,
    post: post._id
});
await comment2.save();

// Retrieve all comments on a post
const comments = await Comment.find({ post: post._id });
console.log("Retrieve all comments on a post:", comments, "\n");

// Update a comment
comment.text = "Updated comment";
console.log("Update a comment:", comment, "\n");

// Delete a comment
Comment.deleteOne({ _id: comment2._id });
console.log("Delete a comment:", comment2, "\n");


// POPULATION:
// How would you populate the author field in a retrieved post document?
const populatedPost = await Post.findById(post._id).populate('author');
console.log("Populate the author field in a retrieved post document:", populatedPost, "\n");

// How would you populate the author field for all posts retrieved?
const populatedPosts = await Post.find().populate('author');
console.log("Populate the author field for all posts retrieved:", populatedPosts, "\n");

// How would you populate the author field and post field for all the comments retrieved?
const populatedComments = await Comment.find().populate('author').populate('post');
console.log("populate the author field and post field for all the comments retrieved:", populatedComments, "\n");

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
console.log("Aggregate the total number of posts per user:", numberOfPostsPerUser, "\n");

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
            from: "posts",
            localField: "_id",
            foreignField: "author",
            as: "posts"
        }
    },
    {
        $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "author",
            as: "comments"
        }
    },
    {
        $addFields: {
            totalPosts: { $size: "$posts" },
            totalComments: { $size: "$comments" }
        }
    },
    {
        $project: {
            _id: 1,
            name: 1,
            totalPosts: 1,
            totalComments: 1,
            totalActivities: { $add: ["$totalPosts", "$totalComments"] }
        }
    },
    {
        $sort: { totalActivities: -1 }
    }
]);

console.log("Most active users:", mostActiveUsers, "\n");

// How would you calculate the average length of posts (in terms of character count) for each user?
const averageLengthPostsPerUser = await Post.aggregate([
    {
        $group: {
            _id: '$author',
            averagePostLength: { $avg: { $strLenCP: '$content' } }
        }
    }
]);

console.log("Average length of posts for each user:", averageLengthPostsPerUser, "\n");

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

console.log("Most common words used across all post titles", mostCommonWords, "\n");

// Can you identify users who have not made any posts or comments?
const usersWithoutActivity = await User.aggregate([
    {
        $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "author",
            as: "posts"
        }
    },
    {
        $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "author",
            as: "comments"
        }
    },
    {
        $match: {
            $and: [
                { posts: { $size: 0 } },
                { comments: { $size: 0 } }
            ]
        }
    }
]);

console.log("Users without any posts or comments:", usersWithoutActivity);


// How would you find the posts that have been inactive for a certain period (e.g., no comments or updates in the last month)?
const lastMonthDate = new Date();
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

const inactivePosts = await Post.aggregate([
    {
        $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "post",
            as: "comments"
        }
    },
    {
        $match: {
            comments: { $not: { $elemMatch: { createdAt: { $gte: lastMonthDate } } } }
        }
    }
]);

console.log("Posts inactive for 1 month:", inactivePosts, "\n");

// Group posts by publication year and calculate average number of comments per post for each year
function getYearRange(year) {
    const startDate = new Date(year, 0, 1); // January 1st
    const endDate = new Date(year, 11, 31, 23, 59, 59); // December 31st, 23:59:59
    return { startDate, endDate };
};

const distinctYears = await Post.distinct('createdAt', { createdAt: { $exists: true } })
    .then(dates => dates.map(date => new Date(date).getFullYear()));

const yearsSet = new Set(distinctYears);
const year_post_map = {}
for (const year of yearsSet) {
    const { startDate, endDate } = getYearRange(year);
    year_post_map[year] = await Post.find({
        createdAt: {
            $gte: startDate,
            $lte: endDate
        }
    });
}

console.log("Year and posts:", year_post_map);