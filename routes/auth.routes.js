const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');

router.get("/signup", (req, res, next) => {
    res.render("auth/signup.hbs");
});

router.post('/signup', (req, res, next) => {
    
    const { username, password} = req.body;
    console.log('form data', req.body)

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            console.log(`hashed password is: ${hashedPassword}`);
            return User.create({
                username,
                password: hashedPassword
            })
        })
        .then(createdUser => {
            console.log('Newly created user:', createdUser)
            res.send(`Congratulations ${createdUser.username}, your account was successfully created.`)
        })
        .catch(err => next(err))
    })

    router.get('/login', (req, res) => res.render('auth/login'));
    
    router.post('/login', (req, res, next) =>{
        const { username, password } = req.body;

        if (username === '' || password === '') {
            res.render('auth/login', {
                errorMessage: 'Must enter both username and password to login.'
            })
            return;
        }

        User.findOne({ username })
            .then(user => {
                if (!user) {
                    res.render('auth/login', { errorMessage: 'Username is not registered. Try a different username.'});
                    return;
                } else if (bcryptjs.compareSync(password, user.password)) {
                    res.render('users/user-profile', { user });
                }else {
                    res.render('auth/login', { errorMessage: 'Incorrect password.'});
                }
            })
            .catch(error => next(error));
    });
    
    
    module.exports = router;
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    