const auth_helper = require('../util/auth_helper')

const tokenExtractor = (request, response, next) => {
    const token = auth_helper.getTokenFrom(request)
    if (token) {
        request.token = token
    }

    next()
}

const userExtractor = async (request, response, next) => {
    const user = await auth_helper.getAuthenticatedUser(request)
    if (user) {
        request.user = user
    }

    next()
}

module.exports = {
    tokenExtractor,
    userExtractor
}