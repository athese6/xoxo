const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');

const crypt = {
    compare: (val1, val2) => {
        val2 = bcrypt.hashSync(val2);
        return bcrypt.compareSync(val1, val2);
    },
    md5: str => crypto.createHash('md5').update(str).digest('hex'),
    password: str => {
        str = crypto.createHash('sha1').update(str).digest('binary');
        str = crypto.createHash('sha1').update(str).digest('hex');
        return "*" + str.toUpperCase();
    },
    encrypt: str => crypt.password(crypt.md5(str)),
};

module.exports = crypt;