const db = require('./database');

const getUser = (username) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
        SELECT *
        FROM users
        WHERE username = ?
        LIMIT 1
      `;

      db.get(sql, [username], (err, row) => {
        if (err) {
            resolve(null);
        } else {
            resolve(row || null);
        }
      });
    } catch (err) {
      resolve(null);
    }
  });
}
const getUserFromLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
        SELECT *
        FROM users
        WHERE username = ?
        AND password = ?
        LIMIT 1
      `;

      db.get(sql, [username, password], (err, row) => {
        if (err) {
            resolve(null);
        } else {
            resolve(row || null);
        }
      });
    } catch (err) {
      resolve(null);
    }
  });
}
const createUser = (username, password, isAdmin = false) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
        INSERT INTO users 
        (username, password, isAdmin)
        VALUES
        (?, ?, ?)
      `;

      db.run(sql, [username, password, isAdmin], (err, row) => {
        if (err) {
            resolve(false);
        } else {
            resolve(true);
        }
      });
    } catch (err) {
      resolve(false);
    }
  });
}

module.exports = {
  getUser,
  getUserFromLogin,
  createUser
}