const auth_helper = require('../util/auth_helper')

const tokenExtractor = (request, response, next) => {
    const token = auth_helper.getTokenFrom(request)
    if (token) {
        request.token = token
    }

    next()
}

module.exports = {
    tokenExtractor
}