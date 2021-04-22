import mysql from '../config/mysql.js';

export const findUserById = (req, res) => {
  const connection = mysql.init();
  mysql.open(connection);

  const query = 'SELECT * from User WHERE id = ?';
  const bindParam = [req.params.id];

  connection.query(query, bindParam, (err, results) => {
    if (err) throw err;
    if (results[0] === undefined) {
      res.send({})
    } else {
      res.send(results[0]);
    }
  });
  mysql.close(connection);
};