module.exports =  {
	Success : (res, message, status='ok', data) => {
		res.status(200).json({
            status: status,
            message: message,
            data: data,
        });
	},
	Create : (res, message, token) => {
		res.status(201).json({
            status: 'ok',
            message: message,
            token: token
        });
	},
	Failed : (res, message) => {
		res.status(500).json({
            status: 'error',
            message: message
        });
	},
	Unauthorized : (res, message) => {
		res.status(401).json({
            status: 'error',
            message: message
        });
	},
	NotFound : (res, message, status='error') => {
		res.status(404).json({
            status: status,
            message: message
        });
	}
}