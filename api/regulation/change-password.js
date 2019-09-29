const resp = require('../middleware/response-status'),
axios = require('axios')
config = require('../middleware/config');

exports.Change = (req, res, next) => {
    try {
        console.log(req.user_access)
        let params = {
            email: req.user_access.email,
            password: req.body
        }
        axios.post(`${config.authentication}/regulation/changePassword`, params)
        .then(response =>{
            // console.log('resp ', response)
            if (response.data.status == 'failed') {
                resp.Success(res, response.data.message, response.data.status)
            } else {
                resp.Success(res, response.data.message)
            }
        })
        .catch(err =>{
            // console.log('err ', err)
            resp.Failed(res, 'Internal Server Error')
        })
    } catch (error) {
        resp.Failed(res, error)
    }
}