const mailer = require('nodemailer'),
config = require('./config');

const transport = mailer.createTransport({
	service: 'gmail',
    auth: {
        user: config.email,
        pass: config.password
    },
    tls: {
    	rejectUnauthorized: false
    }
});

module.exports = {
	sendEmail: (from, to, subject, html)=>{
		return new Promise((resolve, reject) => {
			transport.sendMail({from, to, subject, html},(error, info)=>{
				if (error) {
	                console.log('err email' + error);
	                resolve(false)
	            } else {
	            	console.log('Email sent: ' + info.response);
	            	resolve(true)
	            }
			});
		});			
	}
}