var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog'); //Import routes for "catalog area of site"

//Para comprimir respuestas http
var compression = require('compression'); //Se aplica solo en producción
var helmet = require('helmet'); //Puede arreglar encabezados para proteger de amenazas conocidas. Se hace en entorno de producción

var app = express();

app.use(helmet());

//Configurando la base de datos
var mongoose = require('mongoose');
//var mongoDb = 'mongodb://lib:12345678@localhost:27017/libreria';
var dev_db_url = 'mongodb+srv://lib:12345678fe15cd45454b.ngrok.io/libreriay?retryWrites=true';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDb, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Conexión exitosa a la base de datos!');
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); //Se comprimen todas las rutas
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter); //Add catalog routes to middleware chain

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
