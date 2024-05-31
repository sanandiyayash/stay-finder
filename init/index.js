const mongoose = require('mongoose');
const Listing = require('../models/listing');
const initData = require('./data');

main()
    .then(console.log("Connected to MongoDB"))
    .catch(err => console.log(err));


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

async function initDb() {
    await Listing.deleteMany({});
    // initData.data = initData.data.map((obj) => ({
    //     ...obj, owner: "6628f7b5237ee2ece1739573",
    // }));
    // await Listing.insertMany(initData.data)
}
initDb().then(() => {
    console.log("Data initialized");

});