const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const Review = require("./models/review.js");
const {reviewSchema} = require("./schema.js");


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

const validateListing = (req , res , next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        errmsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404 , errmsg);
    }
    else{
        next();
    }
}

const validateReview = (req , res , next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        errmsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404 , errmsg);
    }
    else{
        next();
    }
}

// app.get("/testListing" , async (req , res)=>{
//     let sampleListing = new Listing({
//         title : "my new villa", 
//         description : "by the beach",
//         price :1200,
//         location :"goa",
//         country : "India"
//     });
//    await sampleListing.save().then(
//         (res)=>{
//             console.log(res);
//         }
//     )
// });

//INDEX ROUTE 
app.get("/listings" , wrapAsync(async(req , res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs" ,{alllistings});
    
}));
//new route
app.get("/listings/new" ,(req, res)=>{
    res.render("listings/new.ejs");
});

//SHOW ROUTE
app.get("/listings/:id" , wrapAsync( async(req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs" , {listing});
    
}));


//CREATE ROUTE
app.post("/listings" , validateListing ,
    wrapAsync(async(req , res)=>{
    // let{title, description , price , image , loaction , country} = req.body

    let listing = req.body.listing;
    const newlisting = new Listing(listing);
    await newlisting.save();
    res.redirect("/listings");
   
}));

//UPDATE ROUTE 
app.put("/listings/:id" , validateListing,wrapAsync(async(req , res)=>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
}));

//EDIT ROUTE 
app.get("/listings/:id/edit" ,wrapAsync(async (req , res )=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("listings/edit.ejs" , {listing});
}));
//DELETE ROUTE 
app.delete("/listings/:id" ,wrapAsync(async (req , res)=>{
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
}));

//REVIEWS ROUTE 
app.post("/listings/:id/reviews"  , validateReview , wrapAsync (async (req, res )=>{
    let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review) ;

   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
   console.log("new review saved");
   res.redirect(`/listings/${listing._id}`);
}));

// DELETE REVIEW ROUTE
app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(async (req , res)=>{
  
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);

}));

app.use( ( req , res , next)=>{
    next(new ExpressError(404 , "Page not found"));
});

app.use((err,req,res,next)=>{
    let{status = 500 , message = "some error occured" } = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs" ,  {err});
});
//ERROR HANDLING MIDDLEWARE


app.listen(8080 , ()=>{
    console.log("serever is listeing to port 8080");
});