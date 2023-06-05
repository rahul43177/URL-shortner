const axios = require('axios')

const checkValidUrl = async (url) =>{
    try {
        if(!url)  {
            return {
                isValid : false ,
                statusCode : 400 ,
                message : "Missing URl"
            }
        }
        const response = await axios.get(url)
        console.log(response)
        if(response.status == 200) {
            return {
                isValid : true , 
                statusCode : 200 ,
                message : "Valid URL"
            }
        }
        else {
            return {
                isValid : false ,
                statusCode : response.status ,
                message : "Invalid URL"
            }
        }
    }catch(error) {
        res.status(500).send({
            status : false ,
            message : error.message
        })
    }
}

module.exports = {checkValidUrl}