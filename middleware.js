const Listing = require('./models/listing')
const Review = require('./models/review')
const { listingSchema, reviewSchema } = require("./ListingValidation");
module.exports.isloggedIn = (req, res, next) => {
    req.session.redirectUrl = req.originalUrl;
    if (!req.isAuthenticated()) {
        req.flash('error', 'you should login');
        return res.redirect('/login');
    }
    next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash('error', "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.vallidateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        // throw new ExpressError(400, error);
        req.flash('error', error.details[0].message);
        return res.redirect('/listings/new');
    } else {
        next();
    }
};
module.exports.vallidateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        // throw new ExpressError(400, error);
        req.flash('error', error.details[0].message);
        return res.redirect(`/listings/${req.params.id}`);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    console.log(req.params);
    let reviewd = await Review.findById(reviewId);
    console.log(reviewd);
    if (!reviewd.author.equals(res.locals.currentUser._id)) {
        req.flash('error', "You are not the owner of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};