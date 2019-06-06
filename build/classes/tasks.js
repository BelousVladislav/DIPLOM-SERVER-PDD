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
const connection_1 = require("../connection");
class task {
    constructor(name, text, theme_id, id, datachange, image_id) {
        this.id = id;
        this.name = name;
        this.text = text;
        this.theme_id = theme_id;
        this.datachange = datachange;
        this.image_id = image_id;
    }
}
exports.task = task;
const GetTasks = (theme_id) => __awaiter(this, void 0, void 0, function* () {
    let StrQuery = 'select id, name, text, theme_id, datachange, image_id from pdd.tasks';
    let tasks = [];
    let row = yield connection_1.client.query(theme_id == undefined ? StrQuery + ' order by id asc' : StrQuery + ` where theme_id = ${theme_id}` + ' order by id asc');
    for (let i = 0; i < row.rows.length; i++) {
        tasks.push(new task(row.rows[i].name, row.rows[i].text, row.rows[i].theme_id, row.rows[i].id, row.rows[i].datachange, row.rows[i].image_id));
    }
    return tasks;
});
exports.GetTasks = GetTasks;
const AddTask = (newTask) => __awaiter(this, void 0, void 0, function* () {
    let qrString = `insert into pdd.tasks(name, text, theme_id, image_id) values(
        '${newTask.name}',
        '${newTask.text}',
        ${newTask.theme_id},
        ${!isNaN(newTask.image_id) ? newTask.image_id : 'null'}
    )`;
    console.log(qrString);
    yield connection_1.client.query(qrString);
});
exports.AddTask = AddTask;
const EditTask = (editTask) => __awaiter(this, void 0, void 0, function* () {
    let qrString = `update pdd.tasks set 
            name = '${editTask.name}', 
            text = '${editTask.text}',
            theme_id = ${editTask.theme_id},
            image_id = ${!isNaN(editTask.image_id) ? editTask.image_id : 'null'}
            where id = ${editTask.id}`;
    console.log(qrString);
    yield connection_1.client.query(qrString);
});
exports.EditTask = EditTask;
const DropTask = (id) => __awaiter(this, void 0, void 0, function* () {
    yield connection_1.client.query(`delete from pdd.tasks where id = ${id}`);
});
exports.DropTask = DropTask;
