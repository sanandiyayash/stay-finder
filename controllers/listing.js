
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({}, null, { sort: { 'createdAt': -1 } });
    res.render("listings/index.ejs", { allListings });
};

module.exports.rendernewform = (req, res) => {
    res.render("listings/new");
};

module.exports.create = async (req, res, next) => {
    try {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 2
        }).send();

        let url = req.file.path;
        let filename = req.file.filename;

        let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = response.body.features[0].geometry;
        await newListing.save();
        console.log(newListing);
        req.flash("success", "Listing created successfully");
        res.redirect("/listings");
    } catch (error) {
        next(error);
    }
};

module.exports.showlisting = async (req, res, next) => {
    try {
        let id = req.params.id;
        let listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
        if (!listing) {
            req.flash("error", "Listing you requested does not exist");
            return res.redirect("/listings");
        }
        res.render("listings/show.ejs", { listing });
    } catch (error) {
        next(error);
    }
};

module.exports.editlisting = async (req, res, next) => {
    try {
        let id = req.params.id;
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested does not exist");
            return res.redirect("/listings");
        }
        let originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
        res.render("listings/edit.ejs", { listing, originalImageUrl });
    } catch (error) {
        next(error);
    }
};

module.exports.updatelisting = async (req, res, next) => {
    try {
        let newListing = req.body.listing;
        let id = req.params.id;
        let listing = await Listing.findByIdAndUpdate(
            id,
            { ...newListing },
            { runValidators: true, new: true }
        );

        if (typeof req.file !== "undefined") {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
            await listing.save();
        }
        req.flash("success", "Listing updated successfully");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        next(error);
    }
};

module.exports.destroylisting = async (req, res, next) => {
    try {
        let id = req.params.id;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing deleted successfully");
        res.redirect("/listings");
    } catch (error) {
        next(error);
    }
};

module.exports.showcategory = async (req, res, next) => {
    try {
        let { category } = req.params;

        let allListings = await Listing.find({ category: category });
        if (allListings.length > 0) {
            res.render("listings/index.ejs", { allListings })

        } else {
            req.flash("error", "No listings found for this category");
            return res.redirect("/listings");
        }

    } catch (error) {
        next(error);
    }


};
