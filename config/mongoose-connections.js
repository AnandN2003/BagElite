const mongoose = require("mongoose");

mongoose
.connect("mongodb://localhost:27017/BagElite")
.then(()=>{
    console.log("connected");
})
.catch((err)=>{
    console.log(err);
});

module.exports = mongoose.connection;