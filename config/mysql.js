import mysql from 'mysql';

const mysqlConnection = {
  init: function () {
    return mysql.createConnection({
      host: process.env.MYSQL_HOST || '132.226.227.186',
      user: process.env.MYSQL_USER || 'voxmon',
      password: process.env.MYSQL_PASS || 'ssacsfd4Vox!',
      database: process.env.MYSQL_DB || 'voxmondb',
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