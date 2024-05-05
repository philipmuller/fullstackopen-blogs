const logger = require('../util/logger')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response, next) => {
    logger.info('Fetching all blogs')
    Blog.find({})
      .then(result => {
        logger.info(result)
        response.json(result)
      })
      .catch(error => next(error))
})
  
blogsRouter.post('/', (request, response, next) => {
    logger.info('Adding new blog', request.body)
    const blog = request.body
    logger.info(`New blog: ${JSON.stringify(blog)}`)
    
    const newBlog = new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
    })
    
    newBlog.save()
    .then(savedBlog => {
        response.json(savedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter