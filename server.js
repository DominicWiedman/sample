const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 8000;

const ideas =require('./routes/ideas');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sample', {
    useNewUrlParser: true
})
    .then(()=> console.log('MongoDB Connected!'))
    .catch(err => console.log(err));




app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverride('_method'));

app.use(session({
    secret: 'key',
    resave: true,
    saveUninitialized: true,
}));

app.use(flash());

app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


app.get('/', (req, res)=> {
    res.render('index');
});

app.get('/about', (req, res)=> {
    res.render('about');
});



app.get('/user/login', (req, res)=>{
    res.send('login');
});

app.get('/user/register', (req, res)=>{
    res.send('reg');
});

app.use('/ideas', ideas);

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});