const mongoose = require("mongoose");
const { listingSchema } = require("../schema");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const lisitingSchema = new mongoose.Schema({
    title: {
        type : String ,
        required :true
    }, 
    description :String , 
    image: {
        type : String ,
        default : "https://images.unsplash.com/photo-1780789594806-bab25c649181?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D",
        set:(v)=>{   
            return v===""? "https://images.unsplash.com/photo-1780789594806-bab25c649181?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D" 
            : v ;
        }
    }, 
    price: Number,
    location : String,
    country:String,
    reviews :[
        {type : Schema.Types.ObjectId,
            ref : "Review"
        },
    ]
});

lisitingSchema.post("findOneAndDelete" , async (listing) =>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
    
})

const Listing = mongoose.model("Listing" , lisitingSchema);
module.exports = Listing;