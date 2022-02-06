const mocha = require('mocha');
const colors = require('colors');
const DefaultAlarm = require('./Alarm');
const SYMBOLS = {
    ok: colors.green('✓'),
    err: colors.red('✖'),
    dot: '․',
    comma: ',',
    bang: '!',
    minus: colors.blue('-')
};
const SPACE = '    ';

module.exports = AlarmReporter;
AlarmReporter.Alarm = DefaultAlarm;

function AlarmReporter(runner, options) {
    mocha.reporters.Base.call(this, runner);

    let failures = 0;
    let ok = 0;
    let pending = 0;
    let projectName = 'Unknown Project';
    let alarm = null;
    if (options && options.reporterOptions) {
        const reporterOptions = options.reporterOptions;
        projectName = reporterOptions.name || projectName;
        let AlarmClass = null;
        const alarmOption = reporterOptions.alarm;
        if (alarmOption) {
            if (typeof alarmOption === 'function') {
                AlarmClass = alarmOption;
            } else if (typeof alarmOption === 'string') {
                AlarmClass = require(alarmOption);
            }
        }

        if (AlarmClass) {
            alarm = new AlarmClass(reporterOptions);
        } else {
            alarm = new DefaultAlarm(reporterOptions);
        }
    }
    let failedMsg = `\n${projectName} -- Mocha Test Failed\n`;
    let startTime = 0;

    runner.on('suite', function (suite) {

        suite.startDate = new Date();
        console.log(suite.title);
    });
    // runner.on('hook', function (test) {//console.log(test);
    // });
    // runner.on('hook end', function (test) {
    // });
    runner.on('pending', function (test) {
        pending++;

        console.log(SPACE, SYMBOLS.minus, test.title);
    });

    runner.on('pass', function (test) {
        ok++;
        console.log(SPACE, SYMBOLS.ok, test.title, `(${test.duration} ms)`);
    });

    runner.on('fail', function (test, err) {
        failures++;
        console.log(SPACE, SYMBOLS.err, test.title, `(${test.duration} ms)`);
        failedMsg += `Failed: ${test.fullTitle()} \nError: ${err.stack} \n\n`;
    });
    runner.on('start', function () {
        startTime = Date.now();
    });

    runner.on('end', function () {
        console.log(colors.green(`${ok} passed`));
        console.log(colors.red(`${failures} failed`));
        console.log(colors.blue(`${pending} pending`));
        console.log('Total time:', (Date.now() - startTime) / 1000, 's');
        if (failures) {
            console.error(failedMsg);
            if (alarm) {
                alarm.sendSync(failedMsg);
            }
        }
    });
}

