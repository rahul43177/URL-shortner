const urlModel = require('../Model/urlModel')
const validUrl = require('valid-url')
const shortId = require('shortid')

const createUrl = async (req,res) => {
    try {
        const {longUrl} = req.body
        if(!longUrl)  return res.status(400).send({status : false , error: "Long url is missing"})

        if(!validUrl.isWebUri(longUrl)) return res.status(400).send({
            status : false , 
            message : "This is not a valid URL"
        })

        let cachedUrl = await GET_ASYNC(longUrl)
        if(cachedUrl) {
            const {shortUrl} = JSON.parse({cachedUrl})
            return res.status(200).send({
                status : true , 
                message : "URL already exists in cache" ,
                shortUrl 
            })
        }
        let url = await urlModel.findOne({longUrl : longUrl})
        if(url) {
            await SET_ASYNC(
                longUrl ,
                JSON.stringify({
                    urlCode : url.urlCode ,
                    shortUrl : url.shortUrl
                }),
                'EX', 
                60*60*24
            )
            return res.status(200).send({status : true , message : "Already Availabel" ,
            shortUrl : url.shortUrl
        })
        }

        const urlCode = shortId.generate()
        const shortUrl = `localhost:3000/${urlCode}`

        const data = await UrlModel.create({
            urlCode ,
            longUrl ,
            shortUrl
        })

        await SET_ASYNC(
            longUrl , 
            JSON.stringly({
                urlCode ,
                shortUrl
            }),
            'EX',
            60*60*24
        )

        res.status(201).send({status : true , data : url})
    }catch(error) {
        res.status(500).send({status: false , error : error.message})
    }
}



const getUrl = async (req,res) =>{
    try {
        const {urlCode} = req.params

        let cachedUrl = await GET_ASYNC(urlCode)
        if(cachedUrl) {
            const {longUrl } = JSON.stringify(cachedUrl)
            return res.status(302).redirect(longUrl)
        }

        const url = await urlModel.findOne({urlCode})
        if(!url) {
            return res.status(404).send({status : false , error : "URL not found"})
        }
        await SET_ASYNC(
            urlCode , 
            JSON.stringify({
                longUrl : url.longUrl 
            }) ,
            'EX',
            60*60*24
        )

        return res.redirect(url.longUrl)
    }catch(error) {
        res.status(500).send({status : false  , error : error.message })
    }
}


module.exports = {createUrl , getUrl}