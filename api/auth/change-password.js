const resp = require('../middleware/response-status'),
jwt = require('jsonwebtoken'),
axios = require('axios'),
config = require('../middleware/config');

exports.Change = (req, res, next) =>{
    try {
        const getToken = jwt.verify(req.params.token, 'fOrg0t-p4sSwoRd');
        console.log(getToken.email)
        let params = {
            pass: req.body.password,
            conf_password: req.body.change_password,
            email: getToken.email
        }
        axios.post(`${config.authentication}/auth/changePassword`, params)
        .then((response) => {
            // console.log(response)
            resp.Success(res, response.data.message)
        })
        .catch((err)=> {
            // console.log(err)
            resp.Failed(res, response.data.message)
        });
    } catch (error) {
        resp.Unauthorized(res, error.message);
    }
}