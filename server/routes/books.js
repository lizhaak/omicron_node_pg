var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';

router.get('/', function(req, res) {
  // Retrieve books from database
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM books', function (err, result) {
      done(); // we are done with our connection, let's close the connetion, I only have 10!
      // if we don't do done, nothing happens and it doesn't close the connection.

      if (err) {
        res.sendStatus(500);
      }


      res.send(result.rows);


    });
  });
});

router.post('/', function (req, res) {
  var book = req.body;  // our book object that we want to add to the database

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('INSERT INTO books (author, title, published, edition, publisher)'
                + 'VALUES ($1, $2, $3, $4, $5)',  //$1 will match book.author, etc.
                [book.author, book.title, book.published, book.edition, book.publisher], //book object pushing values into an array
                function (err, result) {
                  done();

                  if (err) {
                    res.sendStatus(500);
                  }

                  res.sendStatus(201);  //stands for Created something via our POST
                });
  });
});

module.exports = router;
