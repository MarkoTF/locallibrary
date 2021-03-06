var BookInstance = require('../models/bookinstance');

const {body, validationResult} = require('express-validator');
const {sanitizeBody} = require('express-validator');

var Book = require('../models/book');

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res, next) {
    BookInstance.find()
    .populate('book')
    .exec(function (err, list_bookinstances) {
    	if (err) { return next(err); }
    	//Successful, so render
    	res.render('bookinstance_list', {title: 'Book Insrance List', bookinstance_list: list_bookinstances });
    });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {

    BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
      if (err) { return next(err); }
      if (bookinstance==null) { // No results.
          var err = new Error('Book copy not found');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      res.render('bookinstance_detail', { title: 'Copy: '+bookinstance.book.title, bookinstance:  bookinstance});
    })

};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next) {
    Book.find({}, 'title')
    .exec(function (err, books) {
      if(err) { return next(err); }
      //completado, así que renderizar
      res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books});
    });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  
  //Validación de campos
  body('book', 'Book must be specified').trim().isLength({ min: 1 }),
  body('imprint', 'Imprint must be specified').trim().isLength({ min: 1}),
  body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

  //Sanitisar campos
  sanitizeBody('book').escape(),
  sanitizeBody('imprint').escape(),
  sanitizeBody('status').trim().escape(),
  sanitizeBody('due_back').toDate(),

  //Procese requerido despues de la validación y zanitización
  (req, res, next) => {

    //Extración de los errores de validación del requerimiento
    const errors = validationResult(req);

    //Se crea un objeto BookInstace con escaped and trimmed data
    var bookinstance = new BookInstance(
      { book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back
      });

    if(!errors.isEmpty()) {
      //Hay errores. Renderizar con mensage de los errores
      Book.find({}, 'title')
      .exec(function (err, books) {
        if(err) {return next(err); }
        //Listo, renderiar
        res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id , errors: errors.array(), bookinstance: bookinstance });
      });
      return;
    }

    else {
      //Los datos del from son validos
      bookinstance.save(function(err) {
        if(err) { return next(err); }
        res.redirect(bookinstance.url);
      });
    }
  }

];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};
