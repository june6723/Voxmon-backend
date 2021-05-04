import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import client from '../config/redis.js'

export const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {}
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "30m",
      issuer: "yourdomain.com",
      audience: userId
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        return reject(createError.InternalServerError());
      }
      resolve(token);
    })
  })
};

export const signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {}
    const secret = process.env.REFRESH_TOKEN_SECRET ;
    const options = {
      expiresIn: "1y",
      issuer: "yourdomain.com",
      audience: userId
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        return reject(createError.InternalServerError());
      }

      client.SET(userId, token, 'EX', 365*24*60*60, (err, reply) => {
        if (err) {
          console.log(err.message)
          reject(createError.InternalServerError())
          return
        }

        resolve(token);
      })
    })
  })
};

export const verfiyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) return reject(createError.Unauthorized());
      const userId = payload.aud
      client.GET(userId, (err, result) => {
        if (err) {
          console.log(err.message)
          reject(createError.InternalServer())
          return
        }
        if (result === refreshToken) return resolve(userId)
        reject(createError.Unauthorized())
      })
    })
  })
}