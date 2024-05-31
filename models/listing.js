const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename: String
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  location: String,
  country: String,
  category: {
    type: String,
    // enum: ["farmHouse", "house", "villa", "mountain", "dome", "houseBoat"]
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing } });
  }
});
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
