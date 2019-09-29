const jwt = require('jsonwebtoken'),
config = require('../middleware/config'),
redis = require('redis'),
bcrypt = require("bcrypt"),
serverRedis = redis.createClient(`redis://${config.redisLocal}`),
resp = require('../middleware/response-status'),
axios = require('axios');

exports.Login = (req, res, next)=>{
    try {
        serverRedis.select(1,(err, db)=>{});
        serverRedis.hgetall(req.body.email, (err, mailExist) => {
            // var mailExist = null;
            if(mailExist == null){
                var params = {
                    email: req.body.email,
                    password: req.body.password
                };
                axios.post(`${config.authentication}/auth/login`, params)
                .then((response)=> {
        			// console.log('response adalah ', response.data)
        			if (response.data.status == "failed") {
                        resp.Success(res, response.data.message, response.data.status);
        			}else{
                        let data = response.data.message;
        				let token = jwt.sign(data, data.secret_key, {expiresIn: "1D"});
                        resp.Create(res, "Login success", token);
        			}
        		})
        		.catch((err) =>{
        			// console.log(err)
                    resp.Failed(res, "Internal server error");
        		});
            }else if(mailExist.active == "0"){
                resp.Unauthorized(res, 'Your account is not active yet');
            }else{
                bcrypt.compare(req.body.password, mailExist.password, (err, result) => {
                    if(result){
                        var random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                        let params = {
                            user_id: mailExist.id,
                            email: req.body.email,
                            phone_number: mailExist.phone_number,
                            full_name: mailExist.full_name,
                            username: mailExist.username,
                            age: mailExist.age,
                            secret_key: random
                        }
                        const token = jwt.sign(params, random, {expiresIn: "1D"});
                        resp.Create(res, "Login success", token)
                    }else{
                    resp.Success(res, 'Wrong password', 'failed')                        
                    }
                });
            }
        })
    } catch (error) {
        resp.Unauthorized(res, error.message);
    }
};