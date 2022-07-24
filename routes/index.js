const router = require("express").Router();

const { isLoggedIn, isLoggedOut } = require('../middlewares/auth.middleware')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/user-profile', isLoggedIn, (req, res, next) => {
  res.render('users/user-profile.hbs', { user: req.session.currentUser.username })
})
module.exports = router;