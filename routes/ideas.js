const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('./../models/Idea');
const Idea = mongoose.model('ideas');

router.get('/', (req, res)=>{
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', { ideas:ideas});
        });
});

router.post('/edit/:id', (req, res)=>{
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        res.render('ideas/edit', {idea:idea})
    });
});

router.get('/add', (req, res)=>{
    res.render('ideas/add')
});

router.post('/', (req, res)=>{
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
                req.flash('success_msg', 'Added');
                res.redirect('ideas');
            })
    }
});

router.post('/:id', (req, res)=> {
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
            .then(idea => {
                req.flash('success_msg', 'Updated');
                res.redirect('/ideas');
            })
    })
});

router.post('/delete/:id', (req, res)=> {
    Idea.deleteOne({_id: req.params.id})
        .then(()=>{
            req.flash('success_msg', 'Removed');
            res.redirect('/');
        })
});

module.exports = router;