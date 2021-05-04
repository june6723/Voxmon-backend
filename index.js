import express from 'express';
import morgan from 'morgan';
import createError from 'http-errors';
import dotenv from 'dotenv';
import usersRoute from './Routes/User.route.js';
import authRoute from './Routes/Auth.route.js';

dotenv.config();

const app = express();
app.use(morgan('dev'));

// Body Parser Middleware
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Routing
app.use('/auth', authRoute);
app.use('/users', usersRoute);

app.get('/', (req, res) => {
  res.send('Hello to Voxmon API!');
});

app.use(async (req, res, next) => {
  next(createError.NotFound());
})

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error:{
      status: err.status || 500,
      message: err.message,
    }
  })
})

const PORT  = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));