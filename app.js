const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.engine('ejs', ejsMate);
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname , "/public")));

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
main().then(
    ()=>{
        console.log("connected to db");
    }
)
.catch(
    (err)=>{
        console.log(err);
    }
)

async function main(){
    await mongoose.connect(mongo_url);
}

app.get("/" , (req , res)=>{
    res.send("i am root");
});

app.use("/listings" , listings);
app.use("/listings/:id/reviews" , reviews);


app.use( ( req , res , next)=>{
    next(new ExpressError(404 , "Page not found"));
});

app.use((err,req,res,next)=>{
    let{status = 500 , message = "some error occured" } = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs" ,  {err});
});

app.listen(8080 , ()=>{
    console.log("serever is listeing to port 8080");
});