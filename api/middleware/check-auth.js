const jwt = require('jsonwebtoken'),
resp = require('./response-status');

module.exports = (req, res, next) => {
    try {
        req.user_access = jwt.verify(req.headers.authorization.split(" ")[1], req.headers.secret_key);
        next();
    } catch (error) {
        if(error.message === "jwt expired"){
            return resp.Unauthorized(res, "Token expired");
        }else{
            return resp.Unauthorized(res, "Invalid token");
        }
    }
}