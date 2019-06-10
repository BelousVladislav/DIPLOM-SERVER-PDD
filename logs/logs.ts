import * as fs from 'fs';
// 10.10.10.184
export var WriteRequestLog = (req, res):void => {
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
    fs.appendFile('./logs/server.log', data+'\n', () =>{});
    console.log(data);
};