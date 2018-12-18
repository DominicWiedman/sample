if (process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'is URI connect'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/sample'}
}