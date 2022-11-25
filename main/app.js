require('./initPaths')();
const path = require('path');

const cors = require('cors');
const express = require('express');
const createError = require('http-errors');

const apiRouter = require('./routes/api');
const indexRouter = require('./routes/index');
const { config } = require('./utils/store');

/* Routes */
/* End Routes */

const { port } = config;

const app = express();

app.use(cors());
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'ejs');

// Add logger
app.use(
  express.json({
    limit: '50mb',
  }),
);
app.use(
  express.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true,
  }),
);

app.use(express.static(path.join(__dirname, 'pages')));

app.use('/gate', apiRouter);
app.use('/', indexRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  const response = {
    success: false,
    status: err.status,
    error: err.message,
  };

  res.status(err.status || 500).json(response);
});

app.set('port', port);

module.exports = app;
