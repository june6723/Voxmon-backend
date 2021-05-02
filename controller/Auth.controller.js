import createError from 'http-errors';
import mysql from '../config/mysql.js';
import bcrypt from 'bcrypt';
import { signAccessToken } from '../utils/jwt_utils.js';
import { registerSchema } from '../validation/User.validation.js';

export const registerUser = async (req, res, next) => {
  const connection = mysql.init();
  mysql.open(connection);
  try {
    const checkValid = await registerSchema.validateAsync(req.body);
    const { email, password, username } = req.body;
    if (!email || !password || !username) throw createError.BadRequest();

    const searchQuery = 'SELECT email,username from User WHERE email=? or username=?';
    const searchParam = [email, username];

    connection.query(searchQuery, searchParam, async (err, results) => {
      if(err) next(err);
      if(results.length > 0) {
        if(results.length === 2) {
          mysql.close(connection);
          next(createError.Conflict(`email and username is alreaday exists.`));
        }
        else {
          mysql.close(connection);
          email.toLowerCase() === results[0].email.toLowerCase() ? 
            next(createError.Conflict(`${email} is already exists`)) : 
            next(createError.Conflict(`${username} is already exists`));
        }
      }
      else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const inputQuery = 'INSERT INTO User SET ?';
        const inputParam = { email, password: hashedPassword, username };
        connection.query(inputQuery, inputParam, (err, result) => {
          if(err) next(err);
          res.status(200).send();
          mysql.close(connection);
        })
      }
    });
  } catch (error) {
    mysql.close(connection);
    next(error);
  } 
}