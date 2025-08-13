const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash=require('connect-flash');


const LocalStrategy = require("passport-local");

const passport = require("passport");


const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));



const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};





app.use(session({
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());



// These methods handle how user data is stored in and retrieved from the session




app.use(session(sessionOptions));

// Use connect-flash middleware
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});





app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

app.use(session(sessionOptions));




app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);


// 404 handler
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});
