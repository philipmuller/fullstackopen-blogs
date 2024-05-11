const logger = require('../util/logger')
const authHelper = require('../util/auth_helper')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

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
    const user = request.user //using middleware to get user
    const blog = await Blog.findById(request.params.id)
    if (!user || !blog) { return response.status(401).json({ error: 'Not authenticated' })}
    const authUserId = user._id.toString()
    const blogUserId = blog.user.toString()
    if (authUserId !== blogUserId) { return response.status(401).json({ error: 'Authenticated user trying to delete unowned blog' }) }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    console.log('PUT request received')
    const user = request.user
    const blogToUpdate = await Blog.findById(request.params.id)
    const updates = request.body

    if (!user) { return response.status(401).json({ error: 'Not authenticated' })}
    if (!blogToUpdate) { return response.status(404).json({ error: 'Blog not found' })}
    if (!updates) { return response.status(400).json({ error: 'No updates provided' })}

    console.log('User:', user)
    console.log('Blog:', blogToUpdate)
    console.log('Updates:', updates)

    const update =  {
        title: updates.title, 
        author: updates.author, 
        url: updates.url, 
        likes: updates.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, update, { new: true }).populate('user', { username: 1, name: 1 })
    console.log('Updated blog:', updatedBlog)
    response.json(updatedBlog)
})

blogsRouter.post('/', async (request, response) => {
    logger.info('POST request received')
    const user = request.user //using middleware to get user

    if (!user) {
        return response.status(401).json({ error: 'Not authenticated' })
    }

    let blog = new Blog({...request.body, user: user._id})
    user.blogs = user.blogs.concat(blog._id)

    await user.save()

    logger.info('Blog:', blog)

    if (!blog.title || !blog.url) { //SHould be checked with mongoose validation tbh, but that breaks the tests
        return response.status(400).json({ error: 'title missing' })
    }

    if (!blog.likes) {
        blog.likes = 0
    }

    try {
      const result = await blog.save()
      logger.info("Result", result)
      const populatedResult = await Blog.findById(result._id).populate('user', { username: 1, name: 1 })
      logger.info(populatedResult)
      response.status(201).json(populatedResult)
    } catch(error) {
        logger.error(error)
      return response.status(400).json({ error: 'something went wrong' })
    }
})


module.exports = blogsRouter