const  redis = require('redis')
const {promisify} = require('util')

const redisClient = redis.createClient({
    host : 'redis-13834.c264.ap-south-1-1.ec2.cloud.redislabs.com' ,
    port : 13834 ,
    password : "qMoQtZEwlww9jgVLdlOWe7deRgw9vGqK"
})

redisClient.on('connect',  () => {
    console.log(`Connected To Redis`)
})

const SET_ASYNC = promisify(redisClient.set).bind(redisClient)
const GET_ASYNC = promisify(redisClient.get).bind(redisClient)



module.exports = {SET_ASYNC , GET_ASYNC}