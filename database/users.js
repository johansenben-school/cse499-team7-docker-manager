const db = require('./database');
const bcrypt = require("bcryptjs")

const hashPassword = (password) => bcrypt.hash(password, 10);
const getUserCount = () => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
        SELECT COUNT(*)
        FROM users
      `;

      db.get(sql, [], (err, row) => {
        if (err) {
            resolve(0);
        } else {
            resolve(row["COUNT(*)"] || 0);
        }
      });
    } catch (err) {
      resolve(0);
    }
  });
}
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
        LIMIT 1
      `;

      db.get(sql, [username], async (err, row) => {
        if (err) {
          resolve(null);
        } else {
          if (row && await bcrypt.compare(password, row.password)) {
            resolve(row);
            return;
          }
          resolve(null);
        }
      });
    } catch (err) {
      resolve(null);
    }
  });
}
const createUser = (username, password, isAdmin = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `
        INSERT INTO users 
        (username, password, isAdmin)
        VALUES
        (?, ?, ?)
      `;

      db.run(sql, [username, await hashPassword(password), isAdmin], (err) => {
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

const updateUser = (oldUsername, newUsername, email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentUserData = await getUser(oldUsername);
      const sql = `
        UPDATE users
        SET username = ?, email = ?, password = ?
        WHERE username = ?
      `;
      db.run(sql, [newUsername ?? currentUserData.username, email ?? currentUserData.email, await hashPassword(password) ?? currentUserData.password, oldUsername], (err) => {
        if (err) {
          console.error(err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
      resolve(true);
    } catch (err) {
      console.error(err);
      resolve(false);
    }
  });
}

module.exports = {
  getUser,
  getUserFromLogin,
  createUser,
  getUserCount,
  updateUser
}