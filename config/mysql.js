import mysql from 'mysql';

const mysqlConnection = {
  init: function () {
    return mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  },
  open: function (conn) {
    conn.connect(function (err) {
      if (err) {
        console.error('MySQL connection failed.');
        console.error(`Error Code: ${err.code}`);
        console.error(`Error Message: ${err.message}`);
      } else {
        console.log('MySQL connection successful.');
      }
    });
  },
  close: function (conn) {
    conn.end(function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log('MySQL terminate connection.');
      }
    });
  }
};

export default mysqlConnection;