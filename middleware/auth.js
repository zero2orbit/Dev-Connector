const jwt = require('jsonwebtoken')
const config = require('config')


module.exports = function (req, res, next) {
    // Get Token 
    const token = req.header('x-auth-token')

    // Cheak token is present or Not
    if (!token) {
        return res.status(401).json({ msg: 'Assess Denied!'})
    }

    // If u have token then verify it

    try {
        
        const decode = jwt.verify(token, config.get('jwtKey'))

        req.user = decode.user;
        next();

    } catch (e) {
        res.status(401).json({ msg:'Time Out Login Again'})
    }

}