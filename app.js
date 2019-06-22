var express=require('express');
var methodOverride=require("method-override");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require('mongoose');


//APP CONFIG
mongoose.connect("mongodb://127.0.0.1:27017/rest");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine",".ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));


// MONGOOSE MODEL CONFIG
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"Test Blog",
//     image:"https://images.pexels.com/photos/1345191/pexels-photo-1345191.jpeg?cs=srgb&dl=adorable-animal-beagle-1345191.jpg&fm=jpg",
//     body:"Hello this is a blog post!"
// });

//RESTFUL ROUTES

app.get("/",function(req,res) {
    res.redirect("/blogs");
});



app.get("/blogs",function(req,res) {
    Blog.find({},function(err,blogs) {
        if(err) {
            console.log(err);
        } else {
            res.render("index.ejs",{blogs:blogs});
        }
    })
});

// NEW ROUTE
app.get("/blogs/new",function(req,res) {
    res.render("new.ejs");
    
})


// CREATE ROUTE

app.post("/blogs",function(req,res) {
    Blog.create(req.body.blog,function(err,newBlog){
        if(err) {
            res.render("new.ejs");
        } else {
            res.redirect("/blogs");
        }
    })
})

// Show ROUTE

app.get("/blogs/:id",function(req,res) {
    Blog.findById(req.params.id,function(err,foundBlog) {
        if(err) {
            res.redirect("/blogs")
        } else {
            res.render("show",{blog:foundBlog});
        }
    })
})


//EDIT ROUTE

app.get("/blogs/:id/edit",function(req,res) {
    Blog.findById(req.params.id,function(err,foundBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit.ejs",{blog:foundBlog});
        }
    })
    
});

//PUT ROUTE 

app.put("/blogs/:id" ,function(req,res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err,updatedBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    });
    });

// app.post("/blogs/:id" ,function(req,res) {
// Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err,updatedBlog){
//     if(err) {
//         res.redirect("/blogs");
//     } else {
//         res.redirect("/blogs/"+req.params.id);
//     }
// });
// });


//DELETE ROUTE
app.delete("/blogs/:id",function(req,res) {
    // destroy blog
    Blog.findByIdAndDelete(req.params.id,function(err,) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});





app.listen(3000,function() {
    console.log("server started");
})
