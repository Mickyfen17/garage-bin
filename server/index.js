const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if(process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, '../public')));

app.set('port', process.env.PORT || 3000);

app.use('/api/v1', routes);

app.get('/*', (request, response) => {
  response.status(404).send({ error: 'Not Found' });
});

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`Server is listening on ${app.get('port')}.`)
  });
}

module.exports = app;