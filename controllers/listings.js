const Listing = require("../models/listing.js");

module.exports.index = async(req , res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs" ,{alllistings});
    }

module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs")};

module.exports.showListing = async(req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path : "reviews" , populate : {path:"author"},})
    .populate("owner");
    
    if(!listing){
        req.flash("error" , "Listing you requested for does not exist ");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs" , {listing});
};

module.exports.createListing = async(req , res)=>{
    // let{title, description , price , image , loaction , country} = req.body

    let listing = req.body.listing;
    const newlisting = new Listing(listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success" , "New Listing Created !");
    res.redirect("/listings");
   
};

module.exports.renderEditForm = async (req , res )=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "The listing you are looking for is deleted");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs" , {listing});
}
module.exports.updateListing = async(req , res)=>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success" , "Listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req , res)=>{
    let{id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success" , "Listing Deleted");
    res.redirect(`/listings`);
};