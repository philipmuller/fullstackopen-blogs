const jwt = require('jsonwebtoken')
const User = require('../models/user')

function getTokenFrom(request) {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

function decodeToken(token) {
    const decoded = jwt.verify(token, process.env.SECRET)
    console.log("Decoded token", decoded)
    return decoded
}

async function getAuthenticatedUser(request) {
    const token = getTokenFrom(request)
    if (!token) { return null }
    console.log("Token received", token)

    const decodedToken = decodeToken(token)
    if (!decodedToken.id) { return null }
    console.log("Decoded token", decodedToken)
    console.log("Decoded token id", decodedToken.id)
    
    const user = await User.findById(decodedToken.id)
    return user
}

module.exports = {
    getTokenFrom,
    decodeToken,
    getAuthenticatedUser
}