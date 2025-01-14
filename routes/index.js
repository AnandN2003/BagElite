const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
let userModel = require("../models/user-model");

router.get("/",(req,res)=>{
    let error = req.flash("error");
    res.render("index",{error, loggedin:false});
});

router.get("/shop",isLoggedIn,async (req,res)=>{
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop",{products,success});
});

router.get("/cart",isLoggedIn,async (req,res)=>{
    let user = await userModel
        .findOne({email: req.user.email})
        .populate("cart");
    res.render("cart",{user});
});

router.get("/addtocart/:id",isLoggedIn,async (req,res)=>{
    let user = await userModel.findOne({email : req.user.email});
    user.cart.push(req.params.id);
    await user.save();
    req.flash("success","added to cart successfully");
    res.redirect("/shop");
});

router.get("/removefromcart/:id",isLoggedIn,async (req,res)=>{
        let user = await userModel.findOne({ email: req.user.email });
        // Find the index of the item to remove
            const itemIndex = user.cart.indexOf(req.params.id);
        // Remove the item from the cart if it exists
            user.cart.splice(itemIndex, 1);
            await user.save();
            req.flash("success", "Removed from cart successfully");

        res.redirect("/shop");
});

module.exports = router;
