const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 8000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sample', {
    useNewUrlParser: true
})
    .then(()=> console.log('MongoDB Connected!'))
    .catch(err => console.log(err));
require('./models/Idea');
const Idea = mongoose.model('ideas');

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverride('_method'));


app.get('/', (req, res)=> {
    res.render('index');
});

app.get('/about', (req, res)=> {
    res.render('about');
});

app.get('/ideas', (req, res)=>{
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', { ideas:ideas});
        });
});

app.post('/ideas/edit/:id', (req, res)=>{
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        res.render('ideas/edit', {idea:idea})
    });
});

app.get('/ideas/add', (req, res)=>{
    res.render('ideas/add')
});

app.post('/ideas', (req, res)=>{
    let errors= [];
    if (!req.body.title){
        errors.push({text:'Please add a title!'});
    }
    if (!req.body.details){
        errors.push({text:'Please add a details!'});
    }
    if (errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    }else{
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('ideas');
            })
    }
});

app.post('/ideas/:id', (req, res)=> {
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
            .then(idea => {
                res.redirect('/ideas');
            })
    })
});

app.post('/ideas/delete/:id', (req, res)=> {
    Idea.deleteOne({_id: req.params.id})
        .then(()=>{
            res.redirect('/ideas')
        })
});

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});