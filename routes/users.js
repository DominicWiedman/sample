const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

require('../models/User');
const User = mongoose.model('users');


router.get('/login', (req, res)=>{
    res.render('users/login');
});

router.get('/register', (req, res)=>{
    res.render('users/register');
});

router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect:'/ideas',
        failureRedirect:'./login',
        failureFlash: true
    })(req, res, next);
});

router.post('/register', (req, res)=>{
    let errors = [];
    if (req.body.name.length < 3||null){
        errors.push({text: 'Too short name'});
    }
    if (req.body.email.length < 6|| null){
        errors.push({text: 'Please enter a valid email address'});
    }
    if (req.body.password.length < 6){
        errors.push({text: 'Password must be at least 6'});
    }
    if (errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
    } else {
        User.findOne({email: req.body.email})
            .then(user => {
                if (user){
                    req.flash('error_msg', 'Email already registered');
                    res.redirect('./register');
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
                    bcrypt.genSalt(10, (err, salt)=>{
                        bcrypt.hash(newUser.password, salt, (err, hash)=>{
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can Sign In');
                                    res.redirect('./login');
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        })
                    });
                }
            });

    }
});

router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;