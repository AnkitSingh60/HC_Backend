import fetch from "node-fetch";  //NPM package to fetch the API
import express from "express";
import mongoose from "mongoose";
const app = express();
app.use(express.json()); 
const PORT = 5000;


//_____________________________________Database connection____________________________________________________________________


const connect = () => {
    return mongoose.connect("mongodb+srv://ankit:ankit@chatappcluster.fsmp5ry.mongodb.net/?retryWrites=true&w=majority")  // mongoDB database
}

//_____________________________________Post Schema____________________________________________________________________

const postSchema = new mongoose.Schema({  
    user_Id: { type: Number, require: true },
    id: { type: Number, require: true },
    title: { type: String, require: true },
    body: { type: String, require: true },
},
    {
        versionKey: false, // removed __v
        timestamps: true, // createdAt, updatedAt
    }
)

const Post = mongoose.model("post", postSchema);  // post model


//____________________________________Comment Schema_____________________________________________________________________

const commentSchema = new mongoose.Schema({  // comment schema to add comments
    comment: { type: String, require: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true }  // giving ref of "post" to get parent info
},
    {
        versionKey: false, // removed __v
        timestamps: true, // createdAt, updatedAt
    }
)

const Comment = mongoose.model("comment", commentSchema);  // comment model


//________________________________________Get Posts from API_________________________________________________________________

async function getPost() {                                                             
    try {                                                                              // using try n catch to handle the errors
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const posts = await res.json();
        // console.log('posts:', posts);
        for (let i = 0; i < posts.length; i++) {                                       // looping through posts to store in database
            const post = new Post({
                user_Id: posts[i]["user_Id"],
                id: posts[i]["id"],
                title: posts[i]["title"],
                body: posts[i]["body"],
            });
            post.save();                                                        
        }

    } catch (error) {
        console.log('error:', error.message);                       // handling error with catch
    }
}

//_________________________________________________Server check___________________________________________
app.get('/', async (req, res) => {
    res.status(200).send("API is running...")
})



//_________________________________________________GET method for post________________________________________________________

app.get('/posts', async (req, res) => {
    try {
        const allPosts = await Post.find()
        if (allPosts) {
            return res.status(200).send(allPosts);
        } else {
            return res.status(404).send({ message: 'No post found...' });
        }
    } catch (error) {
        console.log('error:', error.message);

    }
})

//________________________________________________Get method for comments_________________________________________________________

app.get('/comments', async (req, res) => {
    try {
        const comment = await Comment.find().populate("user_id")
        if (comment) {
            return res.status(200).send(comment);
        } else {
            return res.status(404).send({ message: 'No comment found...' });
        }
    } catch (error) {
        console.log('error:', error.message);

    }
})

//________________________________________________Post methods for comments_________________________________________________________

app.post('/comments', async (req, res) => {
    try {
        const comment = await Comment.create(req.body);
        return res.status(200).send(comment);
    } catch (error) {
        console.log('error:', error.message);
    }
})

//________________________________________________Server_________________________________________________________

app.listen(PORT, async function () {
    try {
        await connect();
    } catch (error) {
        console.log('error:', error.message)
    }
    console.log(`listening on port ${PORT}...`);
})

getPost()  

//_________________________________________________________________________________________________________
