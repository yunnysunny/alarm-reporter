# alarm-reporter

[![build status][action-image]][action-url]
[![GitHub license](https://img.shields.io/github/license/yunnysunny/alarm-reporter)](https://github.com/yunnysunny/alarm-reporter)
[![node version][node-image]][node-url]

[npm-url]: https://npmjs.org/package/@yunnysunny/alarm-reporter
[action-image]: https://github.com/yunnysunny/alarm-reporter/workflows/CI/badge.svg
[action-url]: https://github.com/yunnysunny/alarm-reporter/actions/workflows/ci.yml

[node-image]: https://img.shields.io/badge/node.js-%3E=_12-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/

[![NPM](https://nodei.co/npm/alarm-reporter.png?downloads=true)](https://nodei.co/npm/alarm-reporter/) 

[中文](readme-cn.md)

The reporter for mocha, supports send alarm message when current mocha test run failed, it's usageful for continuous integration.

## Install
```shell
yarn add alarm-reporter --dev
```

## Usage

Set the parameters of `--reporter` and `--reporter-options` to mocha in your `package.json` file, this is an example as follows:

```json
"scripts": {
    "test": "mocha path_for_test_files --timeout 99999 --reporter node_modules/alarm-reporter --reporter-options 'name=project-name,alarm=the_package_name_of_your_alarm_class'"
},
```

The `alarm` parameter of `repoter-options` is a Class, which should have the function of `sendSync`:

```javascript
class YourAlarm {
    /**
     * @param {object} reporterOption The parameters from the cli parameter --reporter-options
     */
    constructor(reporterOption) {
    }
    /**
     * @param {string} msg The msg you wanna send to team members
     * @returns {Error?}
     */
    sendSync(msg) {
    }
}
```

Notice that , the function name ends with `Sync`, you have to write synchronized code in it. This will been called in the listener of `end` of mocha, the listener doesn't support asynchronous operations, it will exit when all test run finished, doesn't wait for any asynchronous code, such as operation of doing HTTP requests to your notify center.

You can write your http request code in a single js file, and then use  `spawnSync` to make the request run in synchronized mode.

```javascript
// util.js
const { spawnSync } = require('child_process');
/**
 * 
 * @param {Object} option
 * @param {String} option.msg The failed msg.
 */
exports.sendSync = function (option) {
    return spawnSync('node', ['sender.js'], {
        env: {
            ...process.env,
            msg: option.msg
        },
        cwd: __dirname,
    });
};

```

```javascript
// sender.js

const {msg} = process.env;

// run sendin msg code...
```

## License

MIT

