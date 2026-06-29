const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isloggedin} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const { populate } = require("../models/review.js");
const listingController = require("../controllers/listings.js");

//INDEX ROUTE 
router.get("/" , wrapAsync (listingController.index));

//new route
router.get("/new" ,isloggedin , listingController.renderNewForm);

//SHOW ROUTE
router.get("/:id" , wrapAsync(listingController.showListing));

//CREATE ROUTE
router.post("/" , isloggedin , validateListing,
    wrapAsync(listingController.createListing));

//EDIT ROUTE 
router.get("/:id/edit" ,isloggedin,isOwner, wrapAsync(listingController.renderEditForm));

//UPDATE ROUTE 
router.put("/:id" ,isloggedin , isOwner,  validateListing,wrapAsync(listingController.updateListing));

//DELETE ROUTE 
router.delete("/:id" , isloggedin , isOwner , wrapAsync(listingController.destroyListing));

module.exports = router;