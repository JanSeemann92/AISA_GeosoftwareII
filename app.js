var createError = require('http-errors');
const express = require('express');
var path = require('path');
const bodyParses = require('body-parser');

// adding routers
var homeRouter = require('./routes/1_home_route.js');
var calculateAOARouter = require('./routes/2_calculateAOA_route.js'); 
var ownresultAOARouter = require('./routes/2_1_ownresultAOA_route.js')
var demoRouter = require('./routes/3_demo_route.js');
var demoresultAOARouter = require('./routes/3_1_demoresultAOA_route.js')
var downloadRouter = require('./routes/4_download_route');
var aboutRouter = require('./routes/5_about_route');

// adding express-app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// adding routes
app.use('/', homeRouter); 
app.use('/home', homeRouter);
app.use('/AOA', calculateAOARouter);
app.use('/demoresultAOA', demoresultAOARouter);
app.use('/ownresultAOA', ownresultAOARouter);
app.use('/demo', demoRouter);
app.use('/download', downloadRouter);
app.use('/about', aboutRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const multer = require('multer'); 
const fs = require('fs');

const handleError = (err, res) => {
    res
      .status(500)
      .contentType("text/plain")
      .end("Oops! Something went wrong!");
  };

  const upload = multer({
    dest: "/app"
    //"C:/Users/katha/Documents/GitHub/AISA_GeosoftwareII/"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
  });

  app.post(
    "/upload",
    upload.single("upload" /* name attribute of <file> element in your form */),
    (req, res) => {
      const tempPath = req.file.path;
    /*  const targetPath1 = path.join(__dirname, "./data/upload/upload.geojson");
      const targetPath2 = path.join(__dirname, "./data/upload/upload.gpkg");
      const targetPath3 = path.join(__dirname, "./data/upload/upload.rds");

      if (path.extname(req.file.originalname).toLowerCase() === ".geojson" || path.extname(req.file.originalname).toLowerCase() === ".gpkg" || path.extname(req.file.originalname).toLowerCase() === ".rds"){
      if (path.extname(req.file.originalname).toLowerCase() === ".geojson") {
        fs.rename(tempPath, targetPath1, err => {
          if (err) return handleError(err, res);
  
          res
            .status(200)
            .end
        })};
      if (path.extname(req.file.originalname).toLowerCase() === ".gpkg") {
        fs.rename(tempPath, targetPath2, err => {
          if (err) return handleError(err, res);
  
          res
            .status(200)
            .end
        })};
      if (path.extname(req.file.originalname).toLowerCase() === ".rds") {
        fs.rename(tempPath, targetPath3, err => {
          if (err) return handleError(err, res);
  
          res
            .status(200)
            .end
        })};    
      } else {
        fs.unlink(tempPath, err => {
          if (err) return handleError(err, res);
  
          res
            .status(403)
            .contentType("text/plain")
            .end("Only .geojson, .gpkg & .rds files are allowed!");
        });
      }*/
    }
  ); 

module.exports = app;

