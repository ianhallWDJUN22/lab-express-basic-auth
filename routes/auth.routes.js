const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');

const { isLoggedIn, isLoggedOut } = require('../middlewares/auth.middleware');


router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs')
})


router.post('/signup', (req, res, next) => {
    
    const { username, password} = req.body;
    

         if (username === '' || password === '') {
            res.render('auth/signup', {
                errorMessage: 'Must enter both username and password to sign up.'
            })
            return;
        }
    
        User.findOne({ username })
    .then(foundUser => {
        
        if(foundUser === null) {
    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
           return bcryptjs.hash(password, salt);
        })
        .then(hashedPassword => {
            return User.create({
                username,
                password: hashedPassword
            })
        })
        .then(createdUser => {
            console.log('Newly created user:', createdUser)
            res.redirect('/')
            
        })
        
        .catch(err => {
            console.log(err)
            next(err)
        })

    } else {
        res.render('auth/signup.hbs', { errorMessage: 'Username already exists. Choose a different Username.' })
    }

    })
})

    router.get('/login', isLoggedOut,  (req, res, next) => {
        res.render('auth/login')
    });
    
    router.post('/login', isLoggedOut, (req, res, next) =>{
        const { username, password } = req.body;
        // if (username === '' || password === '') {
        //     res.render('auth/login', {
        //         errorMessage: 'Must enter both username and password to login.'
        //     })
        //     return;
        // }

        let myUser;
        User.findOne({ username })
            .then(foundUser => {
                console.log('Found User:', foundUser);
           
                myUser = foundUser;
                if(foundUser === null) {
                res.render('auth/login.hbs', { errorMessage: 'Incorrect username or password.' })
            } else {
            return bcryptjs.compare(password, foundUser.password)
            }

            }) 
            .then(isValidPassword => {
                if(isValidPassword){
                   console.log(req.session)
                    req.session.currentUser = myUser;
                    res.redirect('/user-profile')
                } else {
                res.render('auth/login.hbs', { errorMessage: 'Incorrect Username or password.' })
                }
            })
            .catch(error => next(error));
    });
    

    module.exports = router;