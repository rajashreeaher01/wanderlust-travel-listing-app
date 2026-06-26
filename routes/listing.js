const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
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
    if(!listing){
        req.flash("error" , "Listing you requested for does not exist ");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs" , {listing});
}));

//CREATE ROUTE
router.post("/" , validateListing,
    wrapAsync(async(req , res)=>{
    // let{title, description , price , image , loaction , country} = req.body

    let listing = req.body.listing;
    const newlisting = new Listing(listing);
    await newlisting.save();
    req.flash("success" , "New Listing Created !");
    res.redirect("/listings");
   
}));

//UPDATE ROUTE 
router.put("/:id" , validateListing,wrapAsync(async(req , res)=>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success" , "Listing updated");
    res.redirect(`/listings/${id}`);
}));

//EDIT ROUTE 
router.get("/:id/edit" ,wrapAsync(async (req , res )=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "The listing you are looking for is deleted");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs" , {listing});
}));

//DELETE ROUTE 
router.delete("/:id" ,wrapAsync(async (req , res)=>{
    let{id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success" , "Listing Deleted");
    res.redirect(`/listings`);
}));

module.exports = router;