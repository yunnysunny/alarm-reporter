const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');
const AlarmReporter = require('../');
const assert = require('assert').strict;

let sendCalled = false;
class MyAlarm extends AlarmReporter.Alarm {
    constructor(reporterOption) {
        super(reporterOption);
    }
    send() {

    }
    sendSync() {
        sendCalled = true;
    }
}
const mocha = new Mocha({
    reporter: AlarmReporter,
    reporterOption: {
        name: 'demo',
        alarm: MyAlarm
    }
});
fs.readdirSync(__dirname).filter(function (file) {
    return file.endsWith('.spec.js');
}).forEach(function (file) {
    mocha.addFile(path.join(__dirname, file));
});
mocha.run(function result(failures) {
    assert.equal(failures, 1);
    assert(sendCalled, true);
    console.log('run finished');
});