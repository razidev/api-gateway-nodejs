const config = require('../middleware/config'),
redis = require('redis'),
serverRedis = redis.createClient(`redis://${config.redisLocal}`),
resp = require('../middleware/response-status'),
axios = require('axios'),
mailer = require('../middleware/mailer'),
jwt = require('jsonwebtoken');

exports.Forgot = (req, res, next)=>{
    try {
        serverRedis.select(1,(err, db)=>{});
        serverRedis.hgetall(req.body.email, (err, user)=>{
            var token = jwt.sign({email: req.body.email}, 'fOrg0t-p4sSwoRd', {expiresIn: "1D"});
            let url = `${config.gateway}/gtw/changePassword/${token}`;
            let formForgot = `
                <p>Simply click on the button to set new password</p>
                <p><a href=${url} style='margin: 0 auto;padding: 8px 20px;border-radius: 50px;background-color: #ffc107;color: #fff;text-decoration: none;'>Change Your Password</a></p>
            `;
            // var user = null;
        	if (user == null) {
                let params = {
                    email: req.body.email
                }
                axios.post(`${config.authentication}/auth/forgotPassword`, params)
                .then((response) => {
                    // console.log(response)
                    if (response.data.status == "failed") {
                        resp.NotFound(res, response.data.message)
                    }else{
                        let start = async ()=> {
                            var sent = await mailer.sendEmail("your@email.com", req.body.email, "Reset Password", formForgot);
                            console.log('email ', sent)
                            if(!sent){
                                resp.Failed(res, "Failed sending an email");
                            }else{
                                resp.Success(res, "We just sent an email, please check your email");
                            }
                        }
                        start();
                    }
                })
                .catch((error) => {
                    console.log(error)
                    resp.Failed(res, error);
                });
            }else if(user.active == "0" || user.active == 0){
                resp.Unauthorized(res, "Your account is not verify yet");
            }else{
                let start = async function() {
                    var sent = await mailer.sendEmail("your@email.com", req.body.email, "Reset Password", formForgot);
                    console.log('email ', sent)
                    if(!sent){
                        resp.Failed(res, "Failed sending an email");
                    }else{
                        resp.Success(res, "We just sent an email, please check your email");
                    }
                }
                start();
            }
        })
    } catch (error) {
        resp.Failed(res, error);
    }
}