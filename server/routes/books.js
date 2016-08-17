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

router.get('/:id', function(req, res) {
  var id = req.params.id;
  console.log('id', id);
  // Retrieve books from database
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM books ' +
                'WHERE genre = $1',
                [id],
                function (err, result) {
                  done();

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

    client.query('INSERT INTO books (author, title, published, edition, publisher, genre)'
                + 'VALUES ($1, $2, $3, $4, $5, $6)',  //$1 will match book.author, etc.
                [book.author, book.title, book.published, book.edition, book.publisher, book.genre], //book object pushing values into an array
                function (err, result) {
                  done();

                  if (err) {
                    res.sendStatus(500);
                  }

                  res.sendStatus(201);  //stands for Created something via our POST
                });
  });
});

router.put('/:id', function (req, res) {
  var id = req.params.id;  //id in orange needs to match :id in green, these can be foo if I wanted
  var book = req.body;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('UPDATE books ' +
                  'SET author = $1, ' +
                  'title = $2, ' +
                  'published = $3, ' +
                  'edition = $4, ' +
                  'publisher = $5, ' +
                  'genre = $6 ' +
                  'WHERE id = $7',
                [book.author, book.title, book.published, book.edition, book.publisher, book.genre, id],
              function (err, result) {
                done();

                if(err) {
                  console.log('err', err);
                  res.sendStatus(500);
                } else {
                  res.sendStatus(200);
                }
              });
  });
});

router.delete('/:id', function (req, res) {
  var id = req.params.id;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('DELETE FROM books ' +
                  'WHERE id = $1',
                  [id],
                  function (err, result) {
                    done();

                    if (err) {
                      res.sendStatus(500);
                      return;
                    }

                    res.sendStatus(200);
                  });
  });

});

module.exports = router;
