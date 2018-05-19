function DefaultError(message, field, status) {
    this.message = message;
    this.field = field;
    this.status = status || 500;
    this.errors = {};
    this.stack = (new Error()).stack;
}
DefaultError.prototype = Object.create(Error.prototype);
DefaultError.prototype.constructor = DefaultError;
DefaultError.prototype.push = function (message, field, status) {
    let error;
    if (message instanceof DefaultError) {
        error = message;
    } else {
        error = new DefaultError(message, field, status);
    }
    if (!this.message) {
        this.message = error.message;
    }
    if (error.field) {
        this.errors[error.field] = error;
    }
};
DefaultError.prototype.hasError = function () {
    return Object.keys(this.errors).length || !!(this.message || "").trim();
};

module.exports = DefaultError;