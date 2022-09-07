import fetch from "node-fetch";
import express from "express";
import mongoose from "mongoose";
const app = express();
app.use(express.json());

const PORT = 5000;
const connect = () => {
    return mongoose.connect("mongodb+srv://ankit:ankit@chatappcluster.fsmp5ry.mongodb.net/?retryWrites=true&w=majority")
}
const postSchema = new mongoose.Schema({
    user_Id: { type: Number, require: true },
    id: { type: Number, require: true },
    title: { type: String, require: true },
    body: { type: String, require: true },
})

const Post = mongoose.model("Post", postSchema);

async function getPost() {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const posts = await res.json();
        // console.log('posts:', posts);
        for (let i = 0; i < posts.length; i++) {
            const post = new Post({
                user_Id: posts[i]["user_Id"],
                id: posts[i]["id"],
                title: posts[i]["title"],
                body: posts[i]["body"],
            });
            post.save();
        }

    } catch (error) {
        console.log('error:', error.message);
    }
}

app.get('/', async (req, res) => {
    res.status(200).send("API is running...")
})


app.get('/posts', async (req, res) => {
    const allPosts = await Post.find()
    res.status(200).send(allPosts)
})

app.listen(PORT, async function () {
    try {
        await connect();
    } catch (error) {
        console.log('error:', error.message)
    }
    console.log(`listening on port ${PORT}...`);
})

getPost()
