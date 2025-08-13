const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

// Index
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// New
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

// Create
router.post("/", wrapAsync(async (req, res) => {
    if (!req.body.listing) throw new ExpressError(400, "Send valid data");
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "new listing created!");
    res.redirect("/listings");
}));

// Edit
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// Update
router.put("/:id", wrapAsync(async (req, res) => {
    if (!req.body.listing) throw new ExpressError(400, "Send valid data");
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// Delete
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;
