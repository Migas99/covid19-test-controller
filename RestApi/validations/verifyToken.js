var jwt = require('jsonwebtoken');

module.exports.verifyTokenForUsers = function(req, res, next) {
    const token = req.header('auth-token');
    
    if(!token){
        return res.status(401).send('Acess denied!');
    }

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        if(verified.role == 'user'){
            if(req.params._id == verified._id){
                next();
            } else {
                return res.status(400).send('Invalid token!');
            }
        } else {
            next();
        }
    }catch(err) {
        return res.status(400).send('Invalid token!');
    }
};

module.exports.verifyTokenForTechnicians = function(req, res, next) {

};

module.exports.verifyTokenForRequests = function(req, res, next) {

};