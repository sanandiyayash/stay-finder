const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");

const { isloggedIn, isOwner, vallidateListing } = require('../middleware.js');
const listingControler = require('../controllers/listing.js')

const multer = require('multer');

const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//index route &//create route//in db
router.route('/')
  .get(wrapAsync(listingControler.index))
  .post(
    isloggedIn,
    upload.single('listing[image]'),//uploading image to cloud
    vallidateListing,
    wrapAsync(listingControler.create)
  );

//new route //here we have keep this listings before show route because if we keep it after show route then it will take new as id in show route
router.get("/new", isloggedIn, listingControler.rendernewform);

//search
router.post("/search", async (req, res) => {
  let location = req.body.location;
  const listings = await Listing.find({ location: location })
  if (listings.length > 0) {
    res.render("listings/search", { listings })

  }
  else {
    req.flash("error", "No listings found");
    res.redirect("/listings");
  }

});

router.route("/:id")
  .get(
    wrapAsync(listingControler.showlisting)
  )
  .put(
    isloggedIn,
    isOwner,
    upload.single('listing[image]'),
    vallidateListing,
    wrapAsync(listingControler.updatelisting)
  )
  .delete(
    isloggedIn, isOwner,
    wrapAsync(listingControler.destroylisting)
  );

//edit route
router.get(
  "/:id/edit", isloggedIn, isOwner,
  wrapAsync(listingControler.editlisting)
);


// category

router.get(
  "/category/:category",
  wrapAsync(listingControler.showcategory)
)
module.exports = router;

