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
    return decoded
}

async function getAuthenticatedUser(request) {
    const token = getTokenFrom(request)
    if (!token) { return null }

    const decodedToken = decodeToken(token)
    if (!decodedToken.id) { return null }
    
    const user = await User.findById(decodedToken.id)
    return user
}

module.exports = {
    getTokenFrom,
    decodeToken,
    getAuthenticatedUser
}