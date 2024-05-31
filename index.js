if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
};
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const ejsMate = require("ejs-mate");


const methodOverride = require("method-override");


const { ExpressError } = require("./utils/expressError");



//ROUTES

const session = require("express-session");
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const usersRouter = require("./routes/user");
const MongoStore = require("connect-mongo");//sotre session on db
const { error } = require("console");
const dbUrL = process.env.ATLASBD_URL;

main()
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrL);
}



//set the directory and middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const store = MongoStore.create({
  mongoUrl: dbUrL,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600 //in second
});

store.on("error", () => {
  console.log("error is ", error);
})
//session
const sessionoption = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionoption));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  //here by req.user we can know that user is loggedin or not. if req.user is undefine then user is not loggedin
  res.locals.currentUser = req.user;
  next();
});



app.get("/", (req, res) => {
  res.redirect("/listings");
});

//listing routes
app.use('/listings', listingsRouter);
//review routes
app.use('/listings/:id/reviews', reviewsRouter);
//user route
app.use('/', usersRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "PAGE NOT FOUND!!!"));
});

app.use((err, req, res, next) => {

  let { statusCode = 500, message = "Some thing went wrong" } = err;
  if (statusCode == 404) {
    res.render("pageNotFound", { statusCode });
  } else {
    res.status(statusCode).render("error", { err });
  }
});

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
