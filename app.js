const express = require("express"),
    mongoose = require("mongoose"),
    bodyparser = require("body-parser"),
    app = express(),
    ejsLint = require('ejs-lint'),
    methodOverride = require("method-override"),
    cool = require('cool-ascii-faces'),
    expressSanitizer = require("express-sanitizer");


// connect mongodb
mongoose.connect("mongodb://localhost:27017/restful_blog_app");

// APP CONFIG
//set express to automatically add ejs extension
app.set("view engine", "ejs");
// tell express to look public dir for style sheet
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// mongoose/model config
let blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
let blog = mongoose.model("blog", blogSchema);

// RESTFUL ROUTES
// ROOT route
app.get("/", function(req, res){
    res.redirect("/blogs");
})
// INDEX ROUTE
app.get("/blogs", function(req, res){
    blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR....");
        }else{
            res.render("index", {allblogs: blogs});
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});
// CREATE ROUTE
app.post("/blogs", function(req, res){
    // Create blog
    // used req.body to automatically take title, image and body of blog from ne form
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            // then redirect to the index
            res.redirect("/blogs");
        }
    });    
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    blog.findById(req.params.id, function(err, clickedBlog){
        if(err){
            // remain on the page
            res.redirect("/blogs")
        }else{
            res.render("show", {blog: clickedBlog});
        }
    });
}); 

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, edits){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

// cool route for heroku updates
app.get('/cool', (req, res) => res.send(cool()));


// server
app.listen(3000, function(){
    console.log("REST Server is Running ... ");
});