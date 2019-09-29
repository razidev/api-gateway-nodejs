const resp = require('../middleware/response-status'),
config = require('../middleware/config'),
redis = require('redis'),
serverRedis = redis.createClient(`redis://${config.redisLocal}`),
axios = require('axios'),
jwt = require('jsonwebtoken');

exports.Verify = (req, res, next)=>{
    try {
        const getToken = jwt.verify(req.params.token, 'R3gIsTer_AcC0unT');
        serverRedis.select(1, (err, db) => {})
        serverRedis.hgetall(getToken.email, (err, mailExist) => {
            if (err) {
                resp.Failed(res, "Internal Server Error (redis)");
            } else {
                let params = {
                    email: getToken.email,
                    data: mailExist
                };
                axios.post(`${config.authentication}/auth/register`, params)
                .then((response) => {
                    // console.log(response)
                    if(response.data.status == 'failed'){
                        resp.Success(res, response.data.message, response.data.status);
                    }else{
                        resp.Create(res, response.data.message)
                        let data = ["active", response.data.token.active, "id", response.data.token.user_id]
                        serverRedis.persist(getToken.email, (err, res)=>{}); //delete expire
                        serverRedis.hmset(getToken.email, data, (err, result)=>{})
                        serverRedis.save();
                    }
                })
                .catch((err) => {
                    resp.Failed(res, 'Internal Server Error')
                });
            }
        });
    } catch (error) {
        resp.Unauthorized(res, error.message);
    }
}