const logger = require('../util/logger')
const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    const usersJson = users.map(user => {
        const userJson = user.toJSON()
        delete userJson.password
        return userJson
    })

    response.json(usersJson)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
  
    const saltRounds = 10
    const encryptedPassword = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      username,
      name,
      password: encryptedPassword,
    })
  
    const savedUser = await user.save()
  
    response.status(201).json(savedUser)
})


module.exports = usersRouter