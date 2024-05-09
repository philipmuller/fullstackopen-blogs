const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

describe("Server", () => {
    test('blogs are returned as json', async () => {
        await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
      })

      test('blogs have id property', async () => {
        const blogs = await helper.blogsInDb()
        const blog = blogs[0]
        assert(blog.id)
      })
      
    test('returned number of blogs matches initial state', async () => {
        const blogsAtEnd = await helper.blogsInDb()
    
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('a valid blog can be added ', async () => {
        const newBlog = {
          title: 'async/await simplifies making async calls',
          author: 'Univeristy of Helsinki',
          url: 'https://fullstackopen.com/en/part3/saving_data_to_mongo_db',
          likes: 100
        }
      
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

        const addedBlog = blogsAtEnd[blogsAtEnd.length - 1]
        assert.deepStrictEqual(addedBlog, { ...newBlog, id: addedBlog.id })
    })

    test('blog without likes defaults to 0', async () => {
        const newBlog = {
          title: 'This is a blog without likes',
          author: 'A disliked guy',
          url: 'https://www.dislikedguy.com'
        }

        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const addedBlog = blogsAtEnd[blogsAtEnd.length - 1]
        assert.strictEqual(addedBlog.likes, 0)
    })

    test('blog without title is not added, returns 400 bad request', async () => {
        const newBlog = {
            author: "A cool guy",
            url: "https://www.coolguy.com",
            likes: 1
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })

    test('blog without url is not added, returns 400 bad request', async () => {
        const newBlog = {
            title: "A cool blog",
            author: "A cool guy",
            likes: 1
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })

    test('blog without title is not added', async () => {
        const newBlog = {
          author: "A cool guy",
          url: "https://www.coolguy.com",
          likes: 1
        }
      
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
      
        const blogsAtEnd = await helper.blogsInDb()
      
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
      
    test('there is a blog about thesis writing', async () => {
        const blogs = await helper.blogsInDb()
    
        const contents = blogs.map(e => e.title)
        assert(contents.includes('How I lost my mind writing my thesis'), true)
    })

    test("retreiving a specific blog by ID works", async () => {
        const blogs = await helper.blogsInDb()
        const blog = blogs[0]

        const result = await api
            .get(`/api/blogs/${blog.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.deepStrictEqual(result.body, blog)
    })

    test("deleting a blog by ID works", async () => {
        const blogs = await helper.blogsInDb()
        const blog = blogs[0]

        await api
            .delete(`/api/blogs/${blog.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

        const contents = blogsAtEnd.map(e => e.title)
        assert(!contents.includes(blog.title))
    })

    test("updating a blog by ID works", async () => {
        const blogs = await helper.blogsInDb()
        const blog = blogs[0]

        const updatedBlog = {
            title: "Updated title",
            author: "Updated author",
            url: "https://www.updatedurl.com",
            likes: 789
        }

        await api
            .put(`/api/blogs/${blog.id}`)
            .send(updatedBlog)
            .expect(200)

        const blogAtTheEnd = await helper.blogInDb(blog.id)

        assert.deepStrictEqual(blogAtTheEnd, {...updatedBlog, id: blog.id})
    })

})


after(async () => {
  await mongoose.connection.close()
})