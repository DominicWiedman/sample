if (process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: process.env.MONGODB_URI}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/sample'}
}
