const logger = require('../util/logger')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
    let blog = new Blog(request.body)

    if (!blog.title || !blog.url) { //SHould be checked with mongoose validation tbh, but that breaks the tests
        return response.status(400).json({ error: 'title missing' })
    }

    if (!blog.likes) {
        blog.likes = 0
    }

    try {
      const result = await blog.save()
      logger.info(result)
      response.status(201).json(result)
    } catch {
      return response.status(400).json({ error: 'something went wrong' })
    }
})

module.exports = blogsRouter