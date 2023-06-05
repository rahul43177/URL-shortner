const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    urlCode : {
        type : String , 
        required : [true , "URL code is required"] ,
        unique : true , 
        trim : true
    },
    longUrl : {
        type : String ,
        required : [true , "Long URL is required"] ,
        validate : {
            validator : function(value) {
                const urlRegex = /^(https?|ftp?| http):\/\/[^\s/$.?#].[^\s]*$/;
                return urlRegex.test(value)
            },
            message : "Invalid URL format"
        }
    },
    shortUrl :{
        type : String ,
        required : [true , "Short URL is required"]
    }
})



module.exports = mongoose.model('url',urlSchema)