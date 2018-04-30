const Error = require("../server/models/error");

const lib = {
    isEmail: email => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    name: (name, error) => {
        error = error || new Error();

        if (!name) {
            error.push("Your name cannot be empty.", "name");
        } else if (name.length < 2 || name.length > 30) {
            error.push("Name must be between 2-30 characters", "name");
        }
    },
    email: (email, error) => {
        error = error || new Error();

        if (!email) {
            error.push("Type your email address.", "email");
        } else if (email.length > 35 || !lib.isEmail(email)) {
            error.push("Invalid email address.", "email");
        }
    },
    password: (password, error, field) => {
        error = error || new Error();

        field = field || "password";

        if (!password) {
            error.push("Type your password.", field);
        } else if (password.length < 8 || password.length > 20) {
            error.push("Enter password between 8 and 20 characters.", field);
        }
    },
    agree: (agree, error) => {
        error = error || new Error();

        if (!agree) {
            error.push("Please agree to the Terms of Service.", "agree");
        }
    },
    teamName: (name, error) => {
        error = error || new Error();

        if (!name) {
            error.push("Team name cannot be empty.", "name");
        } else if (name.length < 2 || name.length > 30) {
            error.push("Team name must be between 2-30 characters", "name");
        }
    },
};
module.exports = lib;