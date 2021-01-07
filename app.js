const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const AppError = require('./utility/AppError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/UserRoute.js');
const messageRouter = require('./routes/messageRoutes.js');
//const messageRouter = require('./routes/messageRoutes');

//start express app
const app = express();

//GLOBAL MIDDLEWARE
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
// app.use(cors({ credentials: true, origin: 'http://localhost/' }));

//Set security HTTP headers
app.use(helmet());

//Development Logging in console
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Data Sanitization against NOSQL query injection
app.use(mongoSanitize());

//Data sanitization in postbody, get queries, url params against xss
app.use(xss());
//limit requests form same ID
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try in an hour '
});
app.use('/api', limiter);

//BODY PARSER, READ DATA FORM Req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//test Middleware
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

//Routes Middleware
app.use('/api/v1/users', userRouter);
app.use('/api/v1/message', messageRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
