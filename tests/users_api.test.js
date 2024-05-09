const bcrypt = require('bcrypt')
const User = require('../models/user')
const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const encryptedPassword = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', password: encryptedPassword })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Superuser',
      password: 'test'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.strictEqual(result.body.error, 'username missing')
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'su',
        name: 'Superuser',
        password: 'test'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.strictEqual(result.body.error, 'username too short')
  })

  test('creation fails with proper statuscode and message if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'admin',
        name: 'Superuser'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.strictEqual(result.body.error, 'password missing')
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'admin',
        name: 'Superuser',
        password: '12'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.strictEqual(result.body.error, 'password too short')
  })

})

after(async () => {
    await mongoose.connection.close()
})