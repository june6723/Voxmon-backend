import createError from 'http-errors';
import mysql from '../config/mysql.js';
import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken, verfiyRefreshToken } from '../utils/jwt_utils.js';
import { registerSchema, loginSchema } from '../validation/User.validation.js';
import client from '../config/redis.js'

export const registerUser = async (req, res, next) => {
  const connection = mysql.init();
  mysql.open(connection);
  try {
    const { email, password, username } = await registerSchema.validateAsync(req.body);

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
          email === results[0].email ? 
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
    if (error.isJoi === true) error.status = 422; // unprocessible entity
    next(error);
  } 
};

export const logIn = async (req, res, next) => {
  const connection = mysql.init();
  mysql.open(connection);
  try {
    const { email, password } = await loginSchema.validateAsync(req.body);

    const query = 'SELECT id, email, password from User WHERE email=?';
    const param = [email];
    connection.query(query, param, async (err, result) => {
      if(err) next(err);
      if(result.length === 0) {
        mysql.close(connection);
        next(createError.NotFound("Username/password not valid."));
      }
      else {
        const checkPassword = await bcrypt.compare(password, result[0].password);
        if (!checkPassword) {
          mysql.close(connection);
          next(createError.Unauthorized('Username/password not valid.'));
        }
        else {
          const accessToken = await signAccessToken(result[0].id.toString());
          const refreshToken = await signRefreshToken(result[0].id.toString())
          mysql.close(connection);
          res.send({ accessToken, refreshToken });
        }
      }
    })
  } catch (error) {
    mysql.close(connection);
    if (error.isJoi === true) return next(createError.BadRequest("Invalid input"));
    next(error);
  }
}

export const signNewToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userId = await verfiyRefreshToken(refreshToken);

    const accessToken = await signAccessToken(userId);
    const newRefreshToken = await signRefreshToken(userId);
    res.send({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
}

export const logOut = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) throw createError.BadRequest()
    const userId = await verfiyRefreshToken(refreshToken)
    client.DEL(userId, (err, value) => {
      if (err) {
        console.log(err.message)
        throw createError.InternalServerError()
      }
      console.log(value)
      res.sendStatus(204)
    })
  } catch (error) {
    next(error)
  }
}