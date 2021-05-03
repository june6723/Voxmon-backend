import jwt from 'jsonwebtoken';
import createError from 'http-errors';

export const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {}
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "1h",
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
