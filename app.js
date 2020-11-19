var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/user');
// var adminRouter = require('./routes/admin');
// var activityRouter = require('./routes/activity');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/user', usersRouter);
// app.use('/admin', adminRouter)
// app.use('/activity', activityRouter)


/*
 * initializes all models and sources them as .model-name
 */
fs.readdirSync('./routes').forEach(function(file) {
    var moduleName = file.split('.')[0];
    exports[moduleName + 'Router'] = require('./routes/' + moduleName);
    app.use('/' + moduleName, exports[moduleName + 'Router'])
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
