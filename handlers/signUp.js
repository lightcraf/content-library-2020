const sqlite3 = require("sqlite3").verbose();
const config = require("config");
const dbConfig = config.get("dbConfig");
const db = new sqlite3.Database(`${dbConfig.dbPath}/${dbConfig.dbName}`);
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const jwtSecret = config.get("jwtSecret");

exports.signUpProcessPost = function (req, res) {
    const { username, email, password } = req.body;
    const errors = {
        isNameValid: true,
        isNameValid2: true,
        isEmailValid: true,
        isPasswordValid: true
    };

    const saltRounds = 12;

    const EMAIL_PATTERN = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    const USERNAME_PATTERN = /^[a-zA-Z0-9]{2,16}$/;
    const PASSWORD_PATTERN = /^\S{6,}$/;

    if (!USERNAME_PATTERN.test(username)) {
        errors.isNameValid = false;
    }

    if (!EMAIL_PATTERN.test(email)) {
        errors.isEmailValid = false;
    }

    if (!PASSWORD_PATTERN.test(password)) {
        errors.isPasswordValid = false;
    }

    if (errors.isNameValid && errors.isEmailValid && errors.isPasswordValid) {
        db.serialize(() => {
            db.get("SELECT username FROM users WHERE username = ?", [username], function (err, row) {
                if (err) {
                    throw err;
                }
                if (row) {
                    errors.isNameValid2 = false;
                    return res.send({ errors });
                } else {
                    db.serialize(() => {
                        bcrypt.hash(password, saltRounds, function (err, hash) {
                            db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hash], function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                const payload = {
                                    userId: this.lastID,
                                    username: username
                                };
                                const token = jwt.sign(payload, jwtSecret, { expiresIn: 1000*60*60 });
                                res.cookie("token", token, { expires: new Date(Date.now() + 1000*60*60), httpOnly: true });
                                res.send({ status: 200 });
                            });
                        });
                    });
                }
            });
        });
    } else {
        return res.send({ errors });
    }
};