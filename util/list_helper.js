const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((max, blog) => blog.likes >= max.likes ? blog : max, blogs[0])
}

const mostBlogs = (blogs) => {
    let authors = []

    blogs.forEach(blog => {
        const author = authors.find(a => a.author === blog.author)

        if (author) { //author already present in authors array
            author.blogs++
        } else {
            authors.push({ author: blog.author, blogs: 1 })
        }
    })

    const mostBlogsAuthor = authors.reduce((max, author) => author.blogs >= max.blogs ? author : max, authors[0])
    return mostBlogsAuthor
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
}