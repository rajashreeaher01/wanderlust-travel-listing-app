const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isloggedin} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const { populate } = require("../models/review.js");



//INDEX ROUTE 
router.get("/" , wrapAsync(async(req , res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs" ,{alllistings});
    }));

//new route
router.get("/new" ,isloggedin,(req, res)=>{
    res.render("listings/new.ejs");
});

//SHOW ROUTE
router.get("/:id" , wrapAsync( async(req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path : "reviews" , populate : {path:"author"},})
    .populate("owner");
    
    if(!listing){
        req.flash("error" , "Listing you requested for does not exist ");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs" , {listing});
}));

//CREATE ROUTE
router.post("/" , isloggedin , validateListing,
    wrapAsync(async(req , res)=>{
    // let{title, description , price , image , loaction , country} = req.body

    let listing = req.body.listing;
    const newlisting = new Listing(listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success" , "New Listing Created !");
    res.redirect("/listings");
   
}));

//UPDATE ROUTE 
router.put("/:id" ,isloggedin , isOwner,  validateListing,wrapAsync(async(req , res)=>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success" , "Listing updated");
    res.redirect(`/listings/${id}`);
}));

//EDIT ROUTE 
router.get("/:id/edit" ,isloggedin,isOwner, wrapAsync(async (req , res )=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "The listing you are looking for is deleted");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs" , {listing});
}));

//DELETE ROUTE 
router.delete("/:id" , isloggedin , isOwner , wrapAsync(async (req , res)=>{
    let{id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success" , "Listing Deleted");
    res.redirect(`/listings`);
}));

module.exports = router;