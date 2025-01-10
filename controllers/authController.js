const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/generateToken");

module.exports.registerUser = async (req,res)=>{
    let {fullname,email,password} = req.body;

    let user = await userModel.findOne({email : email});
    if(user) return res.status(401).send("You aldready have an account, please Login!")

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

    if(!user) return res.send("email or password incorrect");

    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            let token = generateToken(user);
            res.cookie("token",token);
            res.send("you can login");
        }
        else{
            return res.send("Email or Password Incorrect");
        }
    })
}