const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const jsonFile = require('jsonfile');
const url = require('url');

const morgan = require('morgan');
const session = require('express-session');

const dotenv = require('dotenv');

dotenv.config();

const indexRouter = require('./routes');
const { unescape, escape, decode } = require('querystring');

const app = express();

app.set('port', process.env.PORT || 8002);
// app.set('view engine', 'html');
// nunjucks.configure('views', {
//   express: app,
//   watch: true,
// });

app.use(morgan('dev'));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use('/', indexRouter);

try {
  const sav1 = unescape(fs.readFileSync('./Neighbor Madam_sf.sav', { encoding:'utf-8' }));
  const sav2 = unescape(fs.readFileSync('./Neighbor Madam_tyrano_data.sav', { encoding:'utf-8' }));
  console.log(sav2.replace(/&quot;/g, '"'));
} catch (err) {
  console.error(err);
}

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
