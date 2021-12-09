const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const LocalStrategy = require('passport-local');

dotenv.config();
const app = express();

const mongoDB = process.env.MONGODB_URL;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
});

//passport config
require('./config/passport')(passport);

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('./views'));

//bodyparser
app.use(express.urlencoded({ extended: true }));

//Express Session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global Variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/recipehome', require('./routes/recipehome'));

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server is up on port ${PORT}`));
