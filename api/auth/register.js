const jwt = require('jsonwebtoken'),
config = require('../middleware/config'),
redis = require('redis'),
bcrypt = require("bcrypt"),
serverRedis = redis.createClient(`redis://${config.redisLocal}`),
resp = require('../middleware/response-status'),
mailer = require('../middleware/mailer');

exports.Register = (req, res, next)=>{
    let nowDate = new Date().getTime().toString().slice(0,10);
    if(serverRedis.connected == true){
        serverRedis.select(1,(err, db)=>{});
        serverRedis.hgetall(req.body.email, (err, mailExist)=>{
            if(mailExist == null){
                var token = jwt.sign({email: req.body.email}, 'R3gIsTer_AcC0unT', {expiresIn: "1D"});

                let url = `${config.gateway}/gtw/verification/${token}`;
                
                var formVerifikasi = `
					<p style='text-align: center;margin-top: 5px;margin-bottom: 5px;'>You have successfully created a Unsircle account</p>
					<p style='text-align: center;margin-top: 5px;margin-bottom: 5px;'><a href=${url} style='margin: 0 auto;padding: 8px 20px;border-radius: 50px;background-color: #ffc107;color: #fff;text-decoration: none;'>Verify Your Email</a></p>`;

                let start = async function() {
                    var sent = await mailer.sendEmail("your@email.com", req.body.email, "Please confirm your email address", formVerifikasi);
                    console.log(sent)
                    if(!sent){
                        resp.Failed(res, "Failed sending an email");
                    }else{
                        bcrypt.hash(req.body.password, 10, (err, hash) => {
                            var regisValue = [
                                "password", hash, "join_date", nowDate, "phone_number", req.body.phone, "full_name", 
                                req.body.full_name, "username", req.body.username.replace(/\s/g,''), "age", req.body.age, "active",
                                "0"
                            ];
                            serverRedis.hmset(req.body.email, regisValue, (err, result)=>{
                                resp.Create(res, "We just sent an email, please check your email");
                            })
                            serverRedis.expire(req.body.email, 86400, (err, result)=>{})//memasang expire selama 1hari
                            serverRedis.save();
                        });
                    }
                }
                start();
            }else{
                resp.Success(res, "Email already registered");
            }
        })
    }else{
        resp.Failed(res, "Internal Server Error (redis)");
    }
};