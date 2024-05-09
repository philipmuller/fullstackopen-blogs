const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "How I lost my mind writing my thesis",
        author: "Philip Muller",
        url: "https://www.philipmuller.com",
        likes: 10000
    },
    {
        title: "How to write a blog",
        author: "John Doe",
        url: "https://www.johndoe.com",
        likes: 6
    }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  //not sure this works because of the toJSON conversion in the blog schema remapping to id
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const blogInDb = async (id) => {
    const blog = await Blog.findById(id)
    return blog.toJSON()
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, blogInDb, usersInDb
}