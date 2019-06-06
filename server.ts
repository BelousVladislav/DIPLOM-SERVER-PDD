import * as express from 'express';
import * as con  from './connection';
import * as fs from 'fs';
import * as parser from 'body-parser';
import { WriteRequestLog } from './logs/logs';
import { image, addImage, getImages, DropImage, EditImage } from './classes/image';

import { user } from './classes/user';
import { theme, getTheme } from './classes/theme';
import bodyParser = require('body-parser');
import{ GetTasks, task, AddTask, EditTask, DropTask } from './classes/tasks'
import { question, getQestions, addQuerstion, editQuerstion, dropQuestion } from './classes/question';
import { answer, getAnswers, addAnswer, editAnswer, dropAnswer } from './classes/answer';
// import { user } from './classes/user';
// import { json } from 'body-parser';
const app = express();
var jsonParser = parser.json();
var urlencodedParser = parser.urlencoded({ extended: false });
try{
    con.connect.then(() => console.log('DB is Worked!!!')).catch((err) =>{console.log(`Ошибка соединения с базой: ${err.stack}`)});
}catch(err){
    console.log(`Ошибка соединения с базой: ${err.stack}`);
}


app.use((req, res, next) =>{
    WriteRequestLog(req, res);
    next();
});
app.get('/getUser/:id', (req, res) => {
    let UserId: number = Number(req.params.id);
    // let thisUser: user; 
    // thisUser = user.getUser(UserId);
    // res.json(thisUser.name);
    res.end();
});
app.get('/getDoc', (req, res) => {
    res.writeHead(200, {"Content-Type":"application/msword"});
    fs.createReadStream("this.doc").pipe(res);
});
app.get('/', (req, res) => {
    res.end('hello server');
});
app.get('/addUser',(req, res) => {
    res.setHeader('Content-Type','text/html');
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
    res.setHeader('Content-Type','application/json');
    con.client.query('select * from pdd.users where id = 1', (err, ress) => {
        if(err){
            console.error(err.stack);
        }else{
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
app.get('/getuser', async (req, res) => {
    let users: user[];
    let userId:number = Number(req.param('userid'));
    try{
        users = await user.getUser(userId);
    }catch(err){
        console.log(err);
    }
    res.json(users);
    res.end;
});
app.post('/adduser', jsonParser, (req, res) =>{
    let newuser: user;
    console.log(`REQ_BODY: ${JSON.stringify(req.body)}`);
    newuser = new user(req.body.name, req.body.last_name, req.body.otchestvo, req.body.login, req.body.password, req.body.id, req.body.is_admin, req.body.user_add);
    res.setHeader('content-type', 'applicaation/json');
    console.log(JSON.stringify(newuser));
    con.client.query(`insert into pdd.users (name, last_name, otchestvo, login, password, is_admin, user_add) 
    values('${newuser.name}','${newuser.last_name}', '${newuser.otchestvo}', '${newuser.login}', '${newuser.password}', ${newuser.is_admin}, ${newuser.user_add})`, (err) =>{
        if(err){
            console.log(err.stack);
            res.json({error_code:2, error_text:err.message});
            res.end();
        }else{
            res.json({status:1});
            res.end();
        }
    })
});
app.post('/edituser', jsonParser, async(req, res) =>{
    let newuser: user;
    console.log(`REQ_BODY: ${JSON.stringify(req.body)}`);
    let UserId: number = Number(req.param('id'));
    newuser = new user(req.body.name, req.body.last_name, req.body.otchestvo, req.body.login, req.body.password, req.body.id, req.body.is_admin, req.body.user_add);
    let STRquery = `update pdd.users set name = '${newuser.name}', last_name = '${newuser.last_name}', otchestvo = '${newuser.otchestvo}', 
    login = '${newuser.login}', password = '${newuser.password}' where id = ${UserId}`;
    con.client.query(STRquery, (err) =>{
        if(err){
            console.log(err.stack);
            res.json({error_code:2, error_text: err.stack});
            res.end();
        }else{
            res.json({status:1});
            res.end();
        }
    })
});
app.get('/removeUser', async (req, res) => {
    let userId: number = Number(req.param('id'));
    console.log(userId);
    res.setHeader('content-type', 'application/json');
    await con.client.query(`delete from pdd.users where id=${userId}`, (err) =>{
        if(err){
            console.log(err.stack);
            res.json({error_code:2, error_text:err.message});
            res.end();
        }else{
            res.json({status: 1});
            res.end();
        }
    }); 
})

app.post('/autorization_user', jsonParser, async(req, res) => {
    let autorization_user: any;
    console.log(req.body);
    res.setHeader('content-type', 'application/json');
    autorization_user = await user.getAutorizationUser(req.body.login+'', req.body.password+'');
    if(autorization_user.hasOwnProperty('_name')){
        res.end(JSON.stringify(autorization_user, ['id','name','last_name','otchestvo','login','password','is_admin','user_add']));
    }else{
        res.end(JSON.stringify(autorization_user));    
    }
})
// 172.20.10.5
//192.168.0.104
const server = app.listen(8080, '172.20.10.5', () => {
    console.log(`192.168.0.104 on 8080`);
})
// ---------------------------------THEMES=--------------------------------------------------
app.get('/themes/get_themes', async(req, res) => {
    let themes: theme[] = []; 
    res.setHeader('content-type','application/json');
    try{
    themes = await getTheme();
    }catch(err){
        console.log(err.stack);
    }
    console.log(JSON.stringify(themes));
    res.json(themes);
    res.end();
});

app.post('/themes/add_themes', jsonParser, (req, res) => {
    let name: string = req.param('name');
    console.log(name)
    res.setHeader('content-type','application/json');
    con.client.query(`insert into pdd.themes(name) values('${name}')`,(err)=>{
        if(err){
            res.json({error_code:2, error_text:err.stack})
            res.end
        }else{
            res.json({status:1});
            res.end()
        }
    })
})
app.post('/themes/drop_theme', jsonParser, (req, res) => {
    let idTheme = req.param('id');
    res.setHeader('content-type','application/json');
    con.client.query(`delete from pdd.themes where id = ${idTheme}`, (err) => {
        if(err){
            res.json({error_code:2, error_text:err.stack})
            res.end
        }else{
            res.json({status:1});
            res.end()
        }
    })
})
app.post('/themes/edit_theme', jsonParser, (req, res) => {
    let idTheme = req.param('id');
    let nameTheme = req.param('name');
    res.setHeader('content-type','application/json');
    con.client.query(`update pdd.themes set name = '${nameTheme}' where id = ${idTheme}`, (err) => {
        if(err){
            res.json({error_code:2, error_text:err.stack})
            res.end
        }else{
            res.json({status:1});
            res.end()
        }
    })    
});

app.get('/tasks', async(req, res) => {

    let themeId = req.param('theme_id')==undefined? undefined: Number(req.param('theme_id'));
    let tasks: task[] = [];
    res.setHeader('content-type','application/json');
    try{
        tasks = await GetTasks(themeId);
        res.json(tasks);
        res.end();
    }catch(err){
        console.log(err.stack);
        res.json({error_code:2, error_text:`errorR: ${err.stack}`});
        res.end();
    }    
});

app.post('/add_task', jsonParser, async(req, res) => {
    let newTask: task;
    res.setHeader('content-type','application/json');
    newTask = new task(
        req.body.name,
        req.body.text,
        Number(req.body.theme_id),
        undefined,
        undefined,
        Number(req.body.image_id)
    );
    console.log(JSON.stringify(newTask));    
    try{
        await AddTask(newTask);
        res.json({status:1});
        res.end()
    }catch(err){
        res.json({error_code:2, error_text:`errorR: ${err.stack}`});   
        res.end() 
    }    
})
app.post('/edit_task', jsonParser, async(req, res) => {
    let editTask: task;
    res.setHeader('content-type','application/json');
    editTask = new task(
        req.body.name,
        req.body.text,
        Number(req.body.theme_id),
        Number(req.body.id),
        undefined,
        Number(req.body.image_id)
    );
    try{
        await EditTask(editTask);
        res.json({status:1});
        res.end()
    }catch(err){
        res.json({error_code:2, error_text:`errorR: ${err.stack}`});   
        res.end() 
    }    
})
app.post('/drop_task', jsonParser, async(req, res) => {
    let taskId: number = Number(req.body.task_id);
    res.setHeader('content-type','application/json');
    try{
        await DropTask(taskId);
        res.json({status:1});
        res.end()
    }catch(err){
        res.json({error_code:2, error_text:`errorR: ${err.stack}`});   
        res.end() 
    }    
})


app.post('/add_image', jsonParser, async(req, res) => {
    let path: string = req.body.path;
    res.setHeader('content-type','application/json');
    try{
        await addImage(path);
        res.json({status:1});
        res.end()
    }catch(err){
        res.json({error_code:2, error_text:`errorR: ${err.stack}`});   
        res.end() 
    }      
});
app.get('/get_images', async(req, res) => {
    let images: image[] = [];
    let image_id = req.param('id')==undefined? undefined: Number(req.param('id'));
    res.setHeader('content-type','application/json');
    try{
        images = await getImages(image_id);
        res.json(images);
        res.end()
    }catch(err){
        res.json({error_code:2, error_text:`errorR: ${err.stack}`});   
        res.end() 
    }      
});
app.post('/edit_image', jsonParser, async(req, res) => {
    let imageq: image;
    imageq =  new image(req.body.path, req.body.id);
    res.setHeader('content-type','application/json');    
    try{
        await EditImage(imageq);
        res.json({status:1});
        res.end()
    }catch(err){
        res.json({error_code:2, error_text:`errorR: ${err.stack}`});   
        res.end() 
    }   
})
app.post('/drop_image', jsonParser, async(req, res) => {
    let id:number =  Number(req.body.id);
    res.setHeader('content-type','application/json');    
    try{
        await DropImage(id);
        res.json({status:1});
        res.end()
    }catch(err){
        res.json({error_code:2, error_text:`errorR: ${err.stack}`});   
        res.end() 
    }   
});

app.get('/questions', async (req, res)=>{
    let TaskId = req.param('task_id')==undefined? undefined: Number(req.param('task_id'));
    let questions: question[];
    res.setHeader('content-type','application/json');  
    try{
        questions = await getQestions(TaskId)
        res.json(questions);
        res.end()
    }catch(err){
        res.json({error_code:2, error_text:`errorR: ${err.stack}`});   
        res.end() 
    }   
});
app.post('/questions/add', jsonParser, async(req, res) =>{
    let newQuestion: question = new question(
        req.body.name,
        req.body.task_id,
        undefined,
        req.body.image_id
    );
    console.log(newQuestion);
    res.setHeader('content-type','application/json');
    try{
        await addQuerstion(newQuestion);
        res.json({status:1});
    }catch(err){
        res.json({error_code:2, error_text:`errorR: ${err.stack}`});   
    } 
    res.end() 
});
// editQuerstion
app.post('/questions/edit', jsonParser, async(req, res) =>{
    let editQuestion: question = new question(
        req.body.name,
        req.body.task_id,
        req.body.id,
        req.body.image_id
    );
    console.log(editQuestion);
    res.setHeader('content-type','application/json');
    try{
        await editQuerstion(editQuestion);
        res.json({status:1});
    }catch(err){
        res.json({error_code:2, error_text:`errorR: ${err.stack}`});   
    } 
    res.end() 
});
//dropQuestion
app.post('/questions/drop', jsonParser, async(req, res) =>{
    let Id = req.param('id')==undefined? undefined: Number(req.param('id'));
    res.setHeader('content-type','application/json');
    try{
        await dropQuestion(Id);
        res.json({status:1});
    }catch(err){
        res.json({error_code:2, error_text:`errorR: ${err.stack}`});   
    } 
    res.end() 
});
app.get('/answers', async (req, res)=>{
    let QuestionId = req.param('question_id')==undefined? undefined: Number(req.param('question_id'));
    let answers: answer[];
    res.setHeader('content-type','application/json');  
    try{
        answers = await getAnswers(QuestionId)
        res.json(answers);
        res.end()
    }catch(err){
        res.json({error_code:2, error_text:`errorR: ${err.stack}`});   
        res.end() 
    }   
});
app.post('/answer/add', jsonParser, async(req, res) =>{
    let newAnswer: answer = new answer(
        req.body.name,
        req.body.question_id,
        req.body.f_right,
        req.body.id
    );
    console.log(newAnswer);
    res.setHeader('content-type','application/json');
    try{
        await addAnswer(newAnswer);
        res.json({status:1});
    }catch(err){
        res.json({error_code:2, error_text:`errorR: ${err.stack}`});   
    } 
    res.end() 
});
app.post('/answer/edit', jsonParser, async(req, res) =>{
    let newAnswer: answer = new answer(
        req.body.name,
        req.body.question_id,
        req.body.f_right,
        req.body.id
    );
    console.log(newAnswer);
    res.setHeader('content-type','application/json');
    try{
        await editAnswer(newAnswer);
        res.json({status:1});
    }catch(err){
        res.json({error_code:2, error_text:`errorR: ${err.stack}`});   
    } 
    res.end() 
});
app.post('/answer/drop', jsonParser, async(req, res) =>{
    let Id = req.param('id')==undefined? undefined: Number(req.param('id'));
    res.setHeader('content-type','application/json');
    try{
        await dropAnswer(Id);
        res.json({status:1});
    }catch(err){
        res.json({error_code:2, error_text:`errorR: ${err.stack}`});   
    } 
    res.end() 
});