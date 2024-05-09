const logger = require('../util/logger')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})
  
blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
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