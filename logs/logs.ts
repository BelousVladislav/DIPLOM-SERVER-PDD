import * as fs from 'fs';

export var WriteRequestLog = (req, res):void => {
    res.setHeader('Access-Control-Allow-Origin', 'http://172.20.10.5:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    let now = new Date();
    let data = `_________________________________________`; 
    data += `\nDate: ${now.getDate()}.${now.getMonth()}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    data += `\nMethod: ${req.method}`;
    data += `\nHeaders: ${req.headers}`;
    data += `\nURL: ${req.url}`;
    fs.appendFile('./logs/server.log', data+'\n', () =>{});
    console.log(data);
};