const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

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

//INDEX ROUTE 
router.get("/" , wrapAsync(async(req , res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs" ,{alllistings});
    }));

//new route
router.get("/new" ,(req, res)=>{
    res.render("listings/new.ejs");
});

//SHOW ROUTE
router.get("/:id" , wrapAsync( async(req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs" , {listing});
}));

//CREATE ROUTE
router.post("/" , validateListing,
    wrapAsync(async(req , res)=>{
    // let{title, description , price , image , loaction , country} = req.body

    let listing = req.body.listing;
    const newlisting = new Listing(listing);
    await newlisting.save();
    res.redirect("/listings");
   
}));

//UPDATE ROUTE 
router.put("/:id" , validateListing,wrapAsync(async(req , res)=>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
}));

//EDIT ROUTE 
router.get("/:id/edit" ,wrapAsync(async (req , res )=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("listings/edit.ejs" , {listing});
}));

//DELETE ROUTE 
router.delete("/:id" ,wrapAsync(async (req , res)=>{
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
}));

module.exports = router;