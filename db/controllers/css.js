const db = require('../db');

const userController = require('./user');

/**
 * @param {number[]} ids
 * @param {function(Error | null, Object[]): void} callback
 */
function getCSSs(ids, callback) {
    db.all(`SELECT * FROM css WHERE id IN (${ids.map(() => '?').join(',')})`, ids, callback);
}

const categories = [
    'button',
    'checkbox',
    'toggle switch',
    'card',
    'loader',
    'input',
    'transition',
    'special effect'
];
/**
 * @param {number} userID
 * @param {string} password_hashed
 * @param {string} name
 * @param {string} html
 * @param {string} css
 * @param {string} category
 * @param {function(Error | null, number): void} callback
 */
function createCSS(userID, password_hashed, name, html, css, category, callback) {
    userController.getUserByID(userID, (err, user) => {
        if (err) {
            callback(err, -1);
            return;
        }

        if (user.password_hashed !== password_hashed) {
            callback(Error('Incorrect password'), -1);
            return;
        }

        if (categories.indexOf(category) === -1) {
            callback(Error('Category does not exist'), -1);
            return;
        }

        db.run(`INSERT INTO css (name, author_id, html, css, category) VALUES (?, ?, ?, ?, ?)`, [name, userID, html, css, category],
            function(err) {
            callback(err, this.lastID);
        });
    });
}

module.exports = {
    getCSSs,
    createCSS,
}