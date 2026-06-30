const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isloggedin} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const { populate } = require("../models/review.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

//INDEX ROUTE
//CREATE ROUTE 
router.route("/")
.get( wrapAsync (listingController.index))
.post(isloggedin , upload.single('listing[image]'), validateListing , 
    wrapAsync(listingController.createListing));



//new route
router.get("/new" ,isloggedin , listingController.renderNewForm);

//SHOW ROUTE/
//UPDATE ROUTE
//DELETE ROUTE
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isloggedin , isOwner, upload.single('listing[image]'), validateListing,wrapAsync(listingController.updateListing))
.delete(  isloggedin , isOwner , wrapAsync(listingController.destroyListing));


//EDIT ROUTE 
router.get("/:id/edit" ,isloggedin,isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;