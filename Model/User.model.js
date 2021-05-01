import mysql from '../config/mysql.js';

export const checkEmailExists = (email, cb) => {
  const connection = mysql.init();
  mysql.open(connection);

  try {
    const query = 'SELECT email from User WHERE email=?';
    const bindParam = [email];

    connection.query(query, bindParam, (err, results) => {
      if(err) throw err;
      if(results.length > 0) {
        return { ok:true, email: results[0].email };
      } else {
        return { ok: true };
      }
    });
  } catch (error) {
    return { ok:false, error };
  } finally {
    mysql.close(connection);
    cb();
  }
}