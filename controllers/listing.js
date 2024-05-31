const Listing = require("../models/listing");
const mbxGeocoging = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoging({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.rendernewform = (req, res) => {
    res.render("listings/new");
}

module.exports.create = async (req, res, next) => {
    //map
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
    })
        .send()

    // img url and filename from cloud
    let url = req.file.path;
    let filename = req.file.filename;

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry
    await newListing.save();
    req.flash("success", "listings created successfully");
    res.redirect("/listings");
};

module.exports.showlisting = async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author', }, }).populate('owner');
    if (!listing) {
        req.flash("error", "listings you requested for does not exists");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.editlisting = async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listings you requested for does not exists");
        res.redirect("/listings");
    }
    //to show image blure, in less pixel .. cloudinary provides this feature
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updatelisting = async (req, res) => {
    let newListing = req.body.listing;
    let id = req.params.id;
    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...newListing },
        { runValidators: true, new: true }
    );

    //edit imape
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "listings updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroylisting = async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listings deleted successfully");
    res.redirect("/listings");
};