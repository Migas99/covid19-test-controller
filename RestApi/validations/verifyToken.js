var jwt = require('jsonwebtoken');

module.exports.verifyTokenForGetAllUsers = function(req, res, next) {
    const token = req.cookie.authToken;
    
    console.log(token);

    if(!token){
        return res.status(401).send('Access denied!');
    }

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);

        if(verified.role == 'user'){
            return res.status(403).send('Access denied!');

        } else {
            next();
        }

    }catch(err) {
        return res.status(401).send('Invalid token!');
    }
};

module.exports.verifyTokenForUpdateDeleteUser = function(req, res, next) {
    const token = req.header('auth-token');
    
    if(!token){
        return res.status(401).send('Access denied!');
    }

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);

        if(verified.role == 'technician'){
            return res.status(403).send('Access denied!');

        } else {

            if(verified.role == 'admin'){
                next();
            } else {
                
            }
            next();
        }

    }catch(err) {
        return res.status(401).send('Invalid token!');
    }
};

module.exports.verifyTokenForGetByIdUser = function(req, res, next) {
    const token = req.header('auth-token');
    
    if(!token){
        return res.status(401).send('Access denied!');
    }

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);

        if(verified.role == 'user'){
            return res.status(403).send('Access denied!');

        } else {
            next();
        }

    }catch(err) {
        return res.status(401).send('Invalid token!');
    }
};