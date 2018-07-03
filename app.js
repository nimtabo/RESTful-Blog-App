let express = require("express"),
    mongoose = require("mongoose"),
    bodyparser = require("body-parser"),
    app = express();

// connect mongodb
mongoose.connect("mongodb://localhost:27017/restful_blog_app");

// APP CONFIG
//set express to automatically add ejs extension
app.set("view engine", "ejs");
// tell express to look public dir for style sheet
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

// mongoose/model config
let blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
let blog = mongoose.model("blog", blogSchema);

blog.create({
    title: "TEST BLOG",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-P1Jm8TpOV0B8GVfT6PKU3qnmDFTJ0qE3ePPK8aqBa4EXwdSf5w",
    body: "Hey seee this test is really impressive have a look at it."
})

// RESTFUL ROUTES
// ROOT
app.get("/", function(req, res){
    res.redirect("/blogs");
})
// INDEX
app.get("/blogs", function(req, res){
    blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR....");
        }else{
            res.render("index", {allblogs: blogs});
        }
    });
});




// server
app.listen(3000, function(){
    console.log("REST Server is Running ... ");
});