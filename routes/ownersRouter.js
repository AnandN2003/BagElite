const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");

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
  
  

if(process.env.NODE_ENV === "development"){
    router.post("/create",async (req,res)=>{
        let owners = await ownerModel.find();
        if(owners.length>0){
            return res.status(503).send("You don't have permisssion to create a new owner.");
        }

        let {fullname,email,password} = req.body;

        let createdOwner = await ownerModel.create({
            fullname : fullname,
            email : email,
            pssword : password,
        });
        res.status(201).send(createdOwner)
    });
}


module.exports = router;