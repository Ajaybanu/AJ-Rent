var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
const session = require("express-session");
const nocache = require("nocache");
const connect = require('./config/server')
var adminRouter = require('./routes/admin');
var userRouter = require('./routes/user');
const hbs = require("hbs");
const { urlencoded } = require('body-parser');
var app = express();
const handlebars = require('handlebars');
const {equal,profit}  =require("./hbshelper/helper")
const { Users } = require('./model/user_Schema');
const flash = require('express-flash');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('limit', function(arr, limit) {
  if (!Array.isArray(arr)) { return []; }
  return arr.slice(0, limit);
});

require('dotenv').config();


const helpers = require('handlebars-helpers')();


handlebars.registerHelper('equal', function(a, b, options) {
  if (a === b) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

const Handlebars = require('handlebars');
Handlebars.registerHelper('equal', helpers.equal);

app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public/images/uploads'))
hbs.registerHelper("equal",equal)
hbs.registerHelper("profit",profit)
app.use(bodyParser.urlencoded({extended:true}))




connect()

app.use(
  session({
    secret: "sessionkey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 6000000 },
  })
);


app.use(nocache());
app.use((req, res, next) => {
  app.locals.session = req.session;
  next();
})
app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});





// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.error(err.stack); 
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  const statusCode = err.status || 500 || 404
  res.status(statusCode).render('404', { statusCode,  layout: "partials/mainlayout" });
});

module.exports = app;
