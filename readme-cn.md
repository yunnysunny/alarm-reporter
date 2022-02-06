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

[English](readme.md)

自定义 mocha 报表工具，支持通过预警接口发送报警邮件，适用于 CI 流程。

## 安装
```shell
yarn add alarm-reporter --dev
```

## 使用

在 mocha 命令后面追加 `--reporter` 和 `--reporter-options` 参数,例如在 package.json 中修改 test 命令：
```json
"scripts": {
    "test": "mocha path_for_test_files --timeout 99999 --reporter node_modules/alarm-reporter --reporter-options 'name=project-name,alarm=the_package_name_of_your_alarm_class'"
},
```

`alarm` 参数是一个类，需要保证其含有 `sendSync` 成员函数：

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

注意到这个函数是以 `Sync` 结尾的，所以你需要在里面写同步代码。这些代码会在 mocha 的 end 事件监听中被调用，这个监听不支持异步代码，它在 mocha 执行完所有测试后会直接退出，不会等待任何异步代码，比如说你可能用到的往某个通知中心发送 HTTP 请求的操作。

你可以将 HTTP 操作封装到单独文件中，然后使用 `spawnSync` 函数，让请求以同步的模式运行。

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

