import express from 'express';
import mysql from './config/mysql.js';
import usersRoute from './routes/users.js';

const app = express();

// Body Parser Middleware
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// MySQL Connection Example

// const connection = mysql.init();
// mysql.open(connection);

// connection.query('select * from User', (err, results) => {
//   if (err) throw err;
//   console.log(results[0]);
// })

// mysql.close(connection);

// Routing
app.use("/users", usersRoute);

app.get('/', (req, res) => {
  res.send('Hello to Voxmon API!');
});

const PORT  = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));