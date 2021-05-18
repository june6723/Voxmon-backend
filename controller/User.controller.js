import mysql from '../config/mysql.js';
import createError from 'http-errors'

export const findUserById = (req, res) => {
  const connection = mysql.init();
  mysql.open(connection);

  const query = 'SELECT id,username,email,mainprofile from User WHERE id = ?';
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


export const findUsers = (req, res, next) => {
  const connection = mysql.init()
  mysql.open(connection)
  
  const { cmd, value } = req.query
  if( !cmd || !value ) return next(createError.BadRequest("cmd or value doesn't exists"))

  const query = `SELECT id,username,email,mainprofile from User WHERE ${cmd} LIKE ?`;
  const bindParam = [`%${value}%`]

  connection.query(query, bindParam, (err, results) => {
    if(err) next(err)
    if(results.length === 0 ) {
      res.send("No matches")
      return
    }
    res.send(results)
    mysql.close(connection);
  });
}

export const findUsersWhileSearching = (req, res, next) => {
  const connection = mysql.init()
  mysql.open(connection)
  
  const { username } = req.params

  const query = `SELECT id,username,email,mainprofile from User WHERE username LIKE ?`;
  const bindParam = [`${username}%`]

  connection.query(query, bindParam, (err, results) => {
    if(err) next(err)
    if(results.length === 0 ) {
      res.send("No matches")
      return
    }
    res.send(results)
    mysql.close(connection);
  });
}

export const sendFriendRequest = (req, res, next) => {
  const userId = req.userId
  const requestId = req.params.id

  const connection = mysql.init()
  mysql.open(connection)

  const query = `INSERT INTO Friend (userid,friendid) VALUES (?,?)`;
  const bindParam = [userId, requestId]

  connection.query(query, bindParam, (err, result) => {
    if(err) return next(createError.InternalServerError())
    if(!result) return next(createError.InternalServerError("No result"))
    res.send({ ok: true })
    mysql.close(connection);
  });
}

export const acceptFriendRequest = (req, res, next) => {
  const myId = req.userId
  const requester = req.params.id

  const connection = mysql.init()
  mysql.open(connection)

  const query1 = `SELECT * from Friend WHERE userid=? AND friendid=?`;
  const bindParam1 = [requester, myId]
  const query2 = `INSERT INTO Friend (userid,friendid) VALUES (?,?)`;
  const bindParam2 = [myId, requester]
  connection.query(query1, bindParam1, (err, result) => {
    if(err) return next(createError.InternalServerError())
    if(!result) return next(createError.BadRequest("No request matches."))

    connection.query(query2, bindParam2, (err,result) => {
      if(err) return next(createError.InternalServerError())
      res.send({ ok: true })
      mysql.close(connection);
    })
  });
}

export const getUserFriends = (req, res, next) => {
  const userId = req.userId
  const connection = mysql.init()
  mysql.open(connection)

  const query1 = `SELECT * from Friend WHERE userid=? AND friendid=?`;
  const bindParam1 = [requester, myId]
}