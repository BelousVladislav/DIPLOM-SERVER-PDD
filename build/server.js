"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const con = require("./connection");
const fs = require("fs");
const parser = require("body-parser");
const logs_1 = require("./logs/logs");
const image_1 = require("./classes/image");
const user_1 = require("./classes/user");
const theme_1 = require("./classes/theme");
const tasks_1 = require("./classes/tasks");
const question_1 = require("./classes/question");
const answer_1 = require("./classes/answer");
// import { user } from './classes/user';
// import { json } from 'body-parser';
const app = express();
var jsonParser = parser.json();
var urlencodedParser = parser.urlencoded({ extended: false });
try {
    con.connect.then(() => console.log('DB is Worked!!!')).catch((err) => { console.log(`Ошибка соединения с базой: ${err.stack}`); });
}
catch (err) {
    console.log(`Ошибка соединения с базой: ${err.stack}`);
}
app.use((req, res, next) => {
    logs_1.WriteRequestLog(req, res);
    next();
});
app.get('/getUser/:id', (req, res) => {
    let UserId = Number(req.params.id);
    // let thisUser: user; 
    // thisUser = user.getUser(UserId);
    // res.json(thisUser.name);
    res.end();
});
app.get('/getDoc', (req, res) => {
    res.writeHead(200, { "Content-Type": "application/msword" });
    fs.createReadStream("this.doc").pipe(res);
});
app.get('/', (req, res) => {
    res.end('hello server');
});
app.get('/addUser', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.end('<form action="/ot" method="GET"><input type="text" name="name[nname]"><input type="submit" value="send"></form>');
});
app.get('/ot', (req, res) => {
    res.set('Content-type', 'application/json');
    console.log(req.method);
    // res.send(req.method);
    res.send(decodeURI(req.query.name.nname));
    res.end();
});
app.get('/product', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    con.client.query('select * from pdd.users where id = 1', (err, ress) => {
        if (err) {
            console.error(err.stack);
        }
        else {
            res.json(ress.rows[0]);
        }
    });
    //res.end('<input type="button" value="OK">');
    // let vlad: user = new user(1, 'Vlad', 'Belous', 'Olegovich', 'belya170372@gmail.com', '150372', true, 1);
    // res.send(`my name is ${vlad.name}`);
});
app.get('/info', (req, res) => {
    res.send('contacts list');
    con.client.query("insert into pdd.users (name, last_name, otchestvo, login, password, is_admin, user_add) values('Vika','Zyuzko', 'Vadimovna', 'email.com', '254367576432', false, 1)");
    console.log('info');
});
app.get('/getuser', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let users;
    let userId = Number(req.param('userid'));
    try {
        users = yield user_1.user.getUser(userId);
    }
    catch (err) {
        console.log(err);
    }
    res.json(users);
    res.end;
}));
app.post('/adduser', jsonParser, (req, res) => {
    let newuser;
    console.log(`REQ_BODY: ${JSON.stringify(req.body)}`);
    newuser = new user_1.user(req.body.name, req.body.last_name, req.body.otchestvo, req.body.login, req.body.password, req.body.id, req.body.is_admin, req.body.user_add);
    res.setHeader('content-type', 'applicaation/json');
    console.log(JSON.stringify(newuser));
    con.client.query(`insert into pdd.users (name, last_name, otchestvo, login, password, is_admin, user_add) 
    values('${newuser.name}','${newuser.last_name}', '${newuser.otchestvo}', '${newuser.login}', '${newuser.password}', ${newuser.is_admin}, ${newuser.user_add})`, (err) => {
        if (err) {
            console.log(err.stack);
            res.json({ error_code: 2, error_text: err.message });
            res.end();
        }
        else {
            res.json({ status: 1 });
            res.end();
        }
    });
});
app.post('/edituser', jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let newuser;
    console.log(`REQ_BODY: ${JSON.stringify(req.body)}`);
    let UserId = Number(req.param('id'));
    newuser = new user_1.user(req.body.name, req.body.last_name, req.body.otchestvo, req.body.login, req.body.password, req.body.id, req.body.is_admin, req.body.user_add);
    let STRquery = `update pdd.users set name = '${newuser.name}', last_name = '${newuser.last_name}', otchestvo = '${newuser.otchestvo}', 
    login = '${newuser.login}', password = '${newuser.password}' where id = ${UserId}`;
    con.client.query(STRquery, (err) => {
        if (err) {
            console.log(err.stack);
            res.json({ error_code: 2, error_text: err.stack });
            res.end();
        }
        else {
            res.json({ status: 1 });
            res.end();
        }
    });
}));
app.get('/removeUser', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let userId = Number(req.param('id'));
    console.log(userId);
    res.setHeader('content-type', 'application/json');
    yield con.client.query(`delete from pdd.users where id=${userId}`, (err) => {
        if (err) {
            console.log(err.stack);
            res.json({ error_code: 2, error_text: err.message });
            res.end();
        }
        else {
            res.json({ status: 1 });
            res.end();
        }
    });
}));
app.post('/autorization_user', jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let autorization_user;
    console.log(req.body);
    res.setHeader('content-type', 'application/json');
    autorization_user = yield user_1.user.getAutorizationUser(req.body.login + '', req.body.password + '');
    if (autorization_user.hasOwnProperty('_name')) {
        res.end(JSON.stringify(autorization_user, ['id', 'name', 'last_name', 'otchestvo', 'login', 'password', 'is_admin', 'user_add']));
    }
    else {
        res.end(JSON.stringify(autorization_user));
    }
}));
// 172.20.10.5
//192.168.0.104
const server = app.listen(8080, '192.168.0.103', () => {
    console.log(`192.168.0.102 on 8080`);
});
// ---------------------------------THEMES=--------------------------------------------------
app.get('/themes/get_themes', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let themes = [];
    res.setHeader('content-type', 'application/json');
    try {
        themes = yield theme_1.getTheme();
    }
    catch (err) {
        console.log(err.stack);
    }
    console.log(JSON.stringify(themes));
    res.json(themes);
    res.end();
}));
app.post('/themes/add_themes', jsonParser, (req, res) => {
    let name = req.param('name');
    console.log(name);
    res.setHeader('content-type', 'application/json');
    con.client.query(`insert into pdd.themes(name) values('${name}')`, (err) => {
        if (err) {
            res.json({ error_code: 2, error_text: err.stack });
            res.end;
        }
        else {
            res.json({ status: 1 });
            res.end();
        }
    });
});
app.post('/themes/drop_theme', jsonParser, (req, res) => {
    let idTheme = req.param('id');
    res.setHeader('content-type', 'application/json');
    con.client.query(`delete from pdd.themes where id = ${idTheme}`, (err) => {
        if (err) {
            res.json({ error_code: 2, error_text: err.stack });
            res.end;
        }
        else {
            res.json({ status: 1 });
            res.end();
        }
    });
});
app.post('/themes/edit_theme', jsonParser, (req, res) => {
    let idTheme = req.param('id');
    let nameTheme = req.param('name');
    res.setHeader('content-type', 'application/json');
    con.client.query(`update pdd.themes set name = '${nameTheme}' where id = ${idTheme}`, (err) => {
        if (err) {
            res.json({ error_code: 2, error_text: err.stack });
            res.end;
        }
        else {
            res.json({ status: 1 });
            res.end();
        }
    });
});
app.get('/tasks', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let themeId = req.param('theme_id') == undefined ? undefined : Number(req.param('theme_id'));
    let tasks = [];
    res.setHeader('content-type', 'application/json');
    try {
        tasks = yield tasks_1.GetTasks(themeId);
        res.json(tasks);
        res.end();
    }
    catch (err) {
        console.log(err.stack);
        res.json({ error_code: 2, error_text: `errorR: ${err.stack}` });
        res.end();
    }
}));
app.post('/add_task', jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let newTask;
    res.setHeader('content-type', 'application/json');
    newTask = new tasks_1.task(req.body.name, req.body.text, Number(req.body.theme_id), undefined, undefined, Number(req.body.image_id));
    console.log(JSON.stringify(newTask));
    try {
        yield tasks_1.AddTask(newTask);
        res.json({ status: 1 });
        res.end();
    }
    catch (err) {
        res.json({ error_code: 2, error_text: `errorR: ${err.stack}` });
        res.end();
    }
}));
app.post('/edit_task', jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let editTask;
    res.setHeader('content-type', 'application/json');
    editTask = new tasks_1.task(req.body.name, req.body.text, Number(req.body.theme_id), Number(req.body.id), undefined, Number(req.body.image_id));
    try {
        yield tasks_1.EditTask(editTask);
        res.json({ status: 1 });
        res.end();
    }
    catch (err) {
        res.json({ error_code: 2, error_text: `errorR: ${err.stack}` });
        res.end();
    }
}));
app.post('/drop_task', jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let taskId = Number(req.body.task_id);
    res.setHeader('content-type', 'application/json');
    try {
        yield tasks_1.DropTask(taskId);
        res.json({ status: 1 });
        res.end();
    }
    catch (err) {
        res.json({ error_code: 2, error_text: `errorR: ${err.stack}` });
        res.end();
    }
}));
app.post('/add_image', jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let path = req.body.path;
    res.setHeader('content-type', 'application/json');
    try {
        yield image_1.addImage(path);
        res.json({ status: 1 });
        res.end();
    }
    catch (err) {
        res.json({ error_code: 2, error_text: `errorR: ${err.stack}` });
        res.end();
    }
}));
app.get('/get_images', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let images = [];
    let image_id = req.param('id') == undefined ? undefined : Number(req.param('id'));
    res.setHeader('content-type', 'application/json');
    try {
        images = yield image_1.getImages(image_id);
        res.json(images);
        res.end();
    }
    catch (err) {
        res.json({ error_code: 2, error_text: `errorR: ${err.stack}` });
        res.end();
    }
}));
app.post('/edit_image', jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let imageq;
    imageq = new image_1.image(req.body.path, req.body.id);
    res.setHeader('content-type', 'application/json');
    try {
        yield image_1.EditImage(imageq);
        res.json({ status: 1 });
        res.end();
    }
    catch (err) {
        res.json({ error_code: 2, error_text: `errorR: ${err.stack}` });
        res.end();
    }
}));
app.post('/drop_image', jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let id = Number(req.body.id);
    res.setHeader('content-type', 'application/json');
    try {
        yield image_1.DropImage(id);
        res.json({ status: 1 });
        res.end();
    }
    catch (err) {
        res.json({ error_code: 2, error_text: `errorR: ${err.stack}` });
        res.end();
    }
}));
app.get('/questions', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let TaskId = req.param('task_id') == undefined ? undefined : Number(req.param('task_id'));
    let questions;
    res.setHeader('content-type', 'application/json');
    try {
        questions = yield question_1.getQestions(TaskId);
        res.json(questions);
        res.end();
    }
    catch (err) {
        res.json({ error_code: 2, error_text: `errorR: ${err.stack}` });
        res.end();
    }
}));
app.post('/questions/add', jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let newQuestion = new question_1.question(req.body.name, req.body.task_id, undefined, req.body.image_id);
    console.log(newQuestion);
    res.setHeader('content-type', 'application/json');
    try {
        yield question_1.addQuerstion(newQuestion);
        res.json({ status: 1 });
    }
    catch (err) {
        res.json({ error_code: 2, error_text: `errorR: ${err.stack}` });
    }
    res.end();
}));
// editQuerstion
app.post('/questions/edit', jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let editQuestion = new question_1.question(req.body.name, req.body.task_id, req.body.id, req.body.image_id);
    console.log(editQuestion);
    res.setHeader('content-type', 'application/json');
    try {
        yield question_1.editQuerstion(editQuestion);
        res.json({ status: 1 });
    }
    catch (err) {
        res.json({ error_code: 2, error_text: `errorR: ${err.stack}` });
    }
    res.end();
}));
//dropQuestion
app.post('/questions/drop', jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let Id = req.param('id') == undefined ? undefined : Number(req.param('id'));
    res.setHeader('content-type', 'application/json');
    try {
        yield question_1.dropQuestion(Id);
        res.json({ status: 1 });
    }
    catch (err) {
        res.json({ error_code: 2, error_text: `errorR: ${err.stack}` });
    }
    res.end();
}));
app.get('/answers', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let QuestionId = req.param('question_id') == undefined ? undefined : Number(req.param('question_id'));
    let answers;
    res.setHeader('content-type', 'application/json');
    try {
        answers = yield answer_1.getAnswers(QuestionId);
        res.json(answers);
        res.end();
    }
    catch (err) {
        res.json({ error_code: 2, error_text: `errorR: ${err.stack}` });
        res.end();
    }
}));
app.post('/answer/add', jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let newAnswer = new answer_1.answer(req.body.name, req.body.question_id, req.body.f_right, req.body.id);
    console.log(newAnswer);
    res.setHeader('content-type', 'application/json');
    try {
        yield answer_1.addAnswer(newAnswer);
        res.json({ status: 1 });
    }
    catch (err) {
        res.json({ error_code: 2, error_text: `errorR: ${err.stack}` });
    }
    res.end();
}));
app.post('/answer/edit', jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let newAnswer = new answer_1.answer(req.body.name, req.body.question_id, req.body.f_right, req.body.id);
    console.log(newAnswer);
    res.setHeader('content-type', 'application/json');
    try {
        yield answer_1.editAnswer(newAnswer);
        res.json({ status: 1 });
    }
    catch (err) {
        res.json({ error_code: 2, error_text: `errorR: ${err.stack}` });
    }
    res.end();
}));
app.post('/answer/drop', jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let Id = req.param('id') == undefined ? undefined : Number(req.param('id'));
    res.setHeader('content-type', 'application/json');
    try {
        yield answer_1.dropAnswer(Id);
        res.json({ status: 1 });
    }
    catch (err) {
        res.json({ error_code: 2, error_text: `errorR: ${err.stack}` });
    }
    res.end();
}));
