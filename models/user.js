const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;


const userSchema = new Schema({
    email : {
        type: String , 
        required:true
    }
});
userSchema.plugin(passportLocalMongoose); //automatically implement username , hashing ,salting and hashpassword , we do not need it to build from strach
userSchema.plugin(passportLocalMongoose); //automatically implement username , hashing ,salting and hashpassword , we do not need it to build from strach

module.exports = mongoose.model("User" , userSchema);