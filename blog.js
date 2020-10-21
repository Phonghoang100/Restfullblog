var express = require("express"),
    app = express(),
    bodyParser = require("body-parser");
    methodOverride = require("method-override");
    expressSanitizer = require("express-sanitizer");
const mongoose = require("mongoose");



mongoose.connect('mongodb://localhost/blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})


app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES STARTS HERE

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    blog.find({}, function(err, blogs){
        if(err){
            console.log("err");
        } else{
             res.render("index", {blogs: blogs});
        }
    })
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
   res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else{
            res.redirect("/blogs");
        }
    });
 });

//  SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
             res.render("show", {blogs: foundBlog});
        }
    })
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
             res.render("edit", {blogs: foundBlog});
        }
    })

});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
   blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
        res.redirect("/blogs");
    } else{
         res.redirect("/blogs/" + req.params.id);
    } 
   })
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else{
             res.redirect("/blogs");
        } 
       }) 
})

app.listen(5000, function(){
    console.log("server is here");
  });