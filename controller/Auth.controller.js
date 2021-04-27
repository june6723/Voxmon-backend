import createError from 'http-errors';
import mysql from '../config/mysql.js';

export const registerUser = async (req, res, next) => {
  const connection = mysql.init();
  mysql.open(connection);
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) throw createError.BadRequest();

    const query = 'SELECT email,username from User WHERE email=? or username=?';
    const bindParam = [email, username];

    connection.query(query, bindParam, (err, results) => {
      if(err) throw err;
      if(results.length > 0) next(createError.Conflict(`${email}, ${username}`));
      else res.send('good');
    });
  } catch (error) {
    mysql.close(connection);
    next(error);
  } finally {
    mysql.close(connection);
  }
  
}