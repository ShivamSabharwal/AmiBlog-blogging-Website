const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');


const Intro = "Hello All , feel free to share you thoughts and anything knowledgeable that could be helpful to your friends, juniors as well as seniors."

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/BlogsDB");

// creating schema for blogs
const blogsSchema = {
  blogTitle: String,
  blogContent: String
};

const Blog = mongoose.model("Blog", blogsSchema);

// creating schema for query
const querySchema = {
  clientName: String,
  clientEmail: String,
  querySubject: String,
  query: String

}

const Query = mongoose.model("Query",querySchema);




app.get("/", function(req, res) {

  Blog.find({}, function(err, blogs) {

    res.render("home", {

      Intro: Intro,

      blogs: blogs

    });

  });

});


app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const newBlog = new Blog ({
    blogTitle: req.body.blog,
    blogContent: req.body.blogContent
  })

  newBlog.save(function(err){

   if (!err){

     res.redirect("/");

   }

 });

});


app.get("/contact", function(req, res) {
  res.render("contact");
});

app.post("/contact",function(req,res){
  const newQuery = new Query ({
    clientName: req.body.name,
    clientEmail: req.body.email,
    querySubject: req.body.subject,
    query: req.body.message
  })

  newQuery.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});






app.get("/blog/:blogId", function(req, res){

const requestedBlogId = req.params.blogId;

  Blog.findOne({_id: requestedBlogId}, function(err, blog){
    res.render("blog", {
      storedTitle: blog.blogTitle,
      storedContent: blog.blogContent
    });
  });

});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
