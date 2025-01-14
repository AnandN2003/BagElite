const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/generateToken");

console.log("NODE_ENV:", process.env.NODE_ENV);

router.get("/admin",(req,res)=>{
    let success = req.flash("success");
    res.render("createproducts",{success});
});

router.delete("/deleteAll", async (req, res) => {
    try {
      await ownerModel.deleteMany(); // Deletes all documents in the collection
      res.send("All owners have been deleted.");
    } catch (error) {
      res.status(500).send("Error deleting owners: " + error.message);
    }
  });
  
  

router.post("/create",async (req,res)=>{
        let owner = await ownerModel.find();
        if(owner.length>0){
          req.flash("error","An owner Aldready Exists.Please Login");
          return res.redirect("/");
        }

        let {fullname,email,password} = req.body;

        bcrypt.genSalt(10,(err,salt)=>{
          bcrypt.hash(password,salt,async (err,hash)=>{
              if(err) return res.status(501).send(err.message);
              else{
                  let createdOwner = await ownerModel.create({
                      fullname : fullname,
                      email : email,
                      password : hash
                  });
  
                  let token = generateToken(owner);
                  res.cookie("token",token);
                  req.flash("error","Account Created successfully. Please Login");
                  return res.redirect("/");
              }
          });
      });
});

router.post("/login", async (req,res)=>{
  let {email,password} = req.body;
  let owner = await ownerModel.findOne({email : email});

  if(!owner){
      req.flash("error","Email or Password incorrect");
      return res.redirect("/");
  }

  bcrypt.compare(password,owner.password,(err,result)=>{
    if(result){
        let token = generateToken(owner);
        res.cookie("token",token);
        let success = req.flash("success");
        res.render("createproducts",{success});
    }
    else{
        req.flash("error","Email or Password incorrect");
        return res.redirect("/");
    }
})

})


module.exports = router;