const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/generateToken");

module.exports.registerUser = async (req,res)=>{
    let {fullname,email,password} = req.body;

    let user = await userModel.findOne({email : email});
    if(user){
        req.flash("error","you aldready have an account , please login");
        return res.redirect("/");
    } 

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async (err,hash)=>{
            if(err) return res.status(501).send(err.message);
            else{
                let user = await userModel.create({
                    fullname : fullname,
                    email : email,
                    password : hash
                });

                let token = generateToken(user);
                res.cookie("token",token);
                res.send("user created successfully");
            }
        });
    });
}

module.exports.loginUser = async (req,res)=>{
    let {email,password} = req.body;

    let user = await userModel.findOne({email : email});

    if(!user){
        req.flash("error","Email or Password incorrect");
        return res.redirect("/");
    } 

    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            let token = generateToken(user);
            res.cookie("token",token);
            res.redirect("/shop");
        }
        else{
            req.flash("error","Email or Password incorrect");
            return res.redirect("/");
        }
    })
}

module.exports.logoutUser = async (req,res)=>{
    res.cookie("token","");
    res.redirect("/");
}