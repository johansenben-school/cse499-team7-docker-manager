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
            resolve(undefined)
        } else {
            resolve(row || null);
        }
      });
    } catch (err) {
      resolve(undefined);
    }
  });
}
const createUser = (username, password, isAdmin = false) => {

}

module.exports = {
  getUser,
  createUser
}