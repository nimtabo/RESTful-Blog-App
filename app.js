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

// RESTFUL ROUTES
// INDEX
app.get("/blogs", function(req, res){
    res.send("index");
});




// server
app.listen(3000, function(){
    console.log("REST Server is Running ... ");
});