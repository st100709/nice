// Dependencies
var express = require('express');
    bodyParser = require('body-parser');
    mongoose = require('mongoose');
    path = require('path');
    moment = require('moment');
    port = 3000;

// Create express app
var app = express();
moment().format();

// Use bodyParser to parse form data sent via HTTP POST
app.use(bodyParser.urlencoded({ extended: true }));

// Tell server where views are and what templating engine I'm using
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// Create connection to database
var connection = mongoose.connect("mongodb://localhost/quotes_db");

// Create dog schema and attach it as a model to our database
var QuoteSchema = new mongoose.Schema({
    name: {type: String},
    quote: {type: String},
  }, {timestamps:true})

// Mongoose automatically looks for the plural version of your model name, so a Dog model in Mongoose looks for 'dogs' in Mongo.
var Quote = mongoose.model('Quote', QuoteSchema);

// Routes go here!
app.get('/', function(req, res){
    res.render('index');
});

app.get('/quotes', function(req, res){
  Quote.find().sort({createdAt : -1 }).exec(function(err, results){
    if (err) { console.log(err); }
    res.render('quotes', { quotes: results });
  });
});

app.post('/quotes', function(req, res){
  // Create a new quote!
  Quote.create(req.body, function(err, results){
    if (err) { console.log(err); }
    res.redirect('/quotes');
  });
});



// // Show
// app.get('/:id', function(req, res){
//   Quote.find({ _id: req.params.id }, function(err, response) {
//     if (err) { console.log(err); }
//     res.render('show', { quote: response[0] });
//   });
// });

// app.get('/:id/edit/', function(req, res){
//   Quote.find({ _id: req.params.id }, function(err, response) {
//     if (err) { console.log(err); }
//     res.render('edit', { quote: response[0] });
//   })
// });

// // Update
// app.post('/:id', function(req, res){
//   Quote.update({ _id: req.params.id }, req.body, function(err, result){
//     if (err) { console.log(err); }
//     res.redirect('/');
//   });
// });

// // Delete
// app.post('/:id/delete', function(req, res){
//   Quote.remove({ _id: req.params.id }, function(err, result){
//     if (err) { console.log(err); }
//     res.redirect('/');
//   });
// });


app.listen(port, function(){
  console.log("Running on", port);
})