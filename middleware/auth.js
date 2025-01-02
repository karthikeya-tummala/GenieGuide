const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access Denied. No token provided');

    try{
        req.user = jwt.verify(token, config.get('jwtPrivateKey'));
        next();
    }
    catch(ex){
        console.log(ex.stack);
        res.status(400).send('Invalid Token');
    }
}

module.exports = auth;