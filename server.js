var app = require('./app');








const PORT = process.env.PORT || 3000;

var listener = app.listen(PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });



  //process.env.PORT || 3000