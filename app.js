//app.js ist der Main Entry Point zur App
var createError = require('http-errors');
const express = require('express');
var path = require('path');
const bodyParses = require('body-parser');


// adding routers
var homeRouter = require('./routes/1_home_route.js');
var calculateAOARouter = require('./routes/2_calculateAOA_route.js'); 
var demoRouter = require('./routes/3_demo_route.js');
var downloadRouter = require('./routes/4_download_route');
var imprintRouter = require('./routes/5_imprint_route');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//adding routes
app.use('/', homeRouter); 
app.use('/home', homeRouter);
app.use('/AOA', calculateAOARouter);
app.use('/demo', demoRouter);
app.use('/download', downloadRouter);
app.use('/imprint', imprintRouter);


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

