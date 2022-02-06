/**
 * 
 */
class Alarm {
    constructor(options) {
        this.options = options;
    }
    send(msg, callback) {
        callback(null);
    }
    sendSync(msg) {
        return null;
    }
}

module.exports = Alarm;