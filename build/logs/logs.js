"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
// 10.10.10.184
exports.WriteRequestLog = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://192.168.0.103:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    let now = new Date();
    let data = `_________________________________________`;
    data += `\nDate: ${now.getDate()}.${now.getMonth()}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    data += `\nMethod: ${req.method}`;
    data += `\nHeaders: ${req.headers}`;
    data += `\nURL: ${req.url}`;
    fs.appendFile('./logs/server.log', data + '\n', () => { });
    console.log(data);
};
