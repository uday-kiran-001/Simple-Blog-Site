
const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const functions=require(__dirname+"/functions.js");
const __=require("lodash");

const app=express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/"));

const homePage="This a blog website. In order to read/post new blogs on this website, you need to login with your username and password. If you do not have an account then you can create a new account and then use this website. You can even SignUp/Login using 'Google', 'Facebook', 'Twitter'. In this website you can read all the blogs which are posted by the existing users. You can also post a new blog after logging in. On the 'Home' page, you can click on the 'Read more' of a particular blog inorder to read it completely. When 'Read more' is clicked, then the user will be directed towards that particular blog post."
const aboutUs="culis nunc sed augue lacus. Tristique nulla aliquet enim tortor at auctor urna. Pulvinar etiam non quam lacus suspendisse faucibus interdum. Egestas congue quisque egestas diam in. Vitae suscipit tellus mauris a diam maecenas sed enim ut. Ridiculus mus mauris vitae ultricies. Vulputate ut pharetra sit amet aliquam. Felis bibendum ut tristique et egestas quis. Sed id semper risus in hendrerit gravida rutrum. Ac felis donec et odio pellentesque diam."

// --------------------------------------------- Mongoose ------------------------------------------- //

mongoose.set("strictQuery",false);
mongoose.connect("mongodb://127.0.0.1:27017/blogWeb");

const blogSchema=mongoose.Schema({
    title:String,
    content:String
})

const BlogModel=new mongoose.model("blog",blogSchema);



// --------------------------------------- Blogs -------------------------------------- //



const defaultBlogs=[{title:"Home page", content:homePage   }];


// ---------------------------------------- post -------------------------------------- //

app.post("/", function(req,res){
    const newBlog=new BlogModel({
        title:req.body.newBlogTitle,
        content:req.body.newblogContent
    })
    newBlog.save();
    res.redirect("/");
});

// ---------------------------------------- get --------------------------------------- //

app.get("/", function(req,res){
    BlogModel.find({},function(err,foundBlogs){
        if(!err){
            if(!foundBlogs){
                console.log("No blogs found.");
                res.render(__dirname+"/views/index",{
                    defaultBlogs:defaultBlogs,
                    newBlogs:[]
                })
            }else{
                console.log("New blogs found. here");
                res.render(__dirname+"/views/index",{
                    defaultBlogs:defaultBlogs,
                    newBlogs:foundBlogs
                })
            }
        }
    })
});

app.get("/aboutUs", function(req,res){
    console.log(req.url);
    res.render(__dirname+"/views/about",{
        title:"About Us",
        description:aboutUs
    });
});

app.get("/composeBlog", function(req,res){
    res.render(__dirname+"/views/composeBlog");
});

app.get("/blogs/:postId", function(req,res){
    const postId=req.params.postId;

    BlogModel.findOne({_id:postId},function(err,foundBlog){
        if(!err){
            if(!foundBlog){
                console.log("No blog is found.");
                res.redirect("/");
            }else{
                console.log("Blog found.");
                res.render(__dirname+"/views/blogLayout",{
                    blog:foundBlog
                });
            }
        }
    })
});

// ---------------------------------------- listen --------------------------------------- //

app.listen(3000, function(){
    console.log("Server started on port 3000 ?");
});


