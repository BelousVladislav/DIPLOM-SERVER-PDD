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
const util_1 = require("util");
class question {
    constructor(name, task_id, id, image_id) {
        this.id = id;
        this.name = name;
        this.task_id = task_id;
        this.image_id = image_id;
    }
}
exports.question = question;
const getQestions = (task_id) => __awaiter(this, void 0, void 0, function* () {
    let StrQuery = 'select id, name, image_id, task_id from pdd.questions';
    let row;
    let questions = [];
    row = yield connection_1.client.query(util_1.isUndefined(task_id) ? StrQuery + ' order by id asc' : StrQuery + ` where task_id = ${task_id}` + ' order by id asc');
    for (let i = 0; i < row.rows.length; i++) {
        questions.push(new question(row.rows[i].name, row.rows[i].task_id, row.rows[i].id, row.rows[i].image_id));
    }
    return questions;
});
exports.getQestions = getQestions;
const addQuerstion = (newQuestion) => __awaiter(this, void 0, void 0, function* () {
    let StrQuery = `insert into pdd.questions(name, task_id, image_id) values(
        '${newQuestion.name}', ${newQuestion.task_id}, ${util_1.isUndefined(newQuestion.image_id) ? null : newQuestion.image_id})`;
    yield connection_1.client.query(StrQuery);
});
exports.addQuerstion = addQuerstion;
const editQuerstion = (editQuestion) => __awaiter(this, void 0, void 0, function* () {
    let StrQuery = `update pdd.questions set 
                        name = '${editQuestion.name}', 
                        task_id= ${editQuestion.task_id}, 
                        image_id = ${util_1.isUndefined(editQuestion.image_id) ? null : editQuestion.image_id}
                    where id = ${editQuestion.id}`;
    yield connection_1.client.query(StrQuery);
});
exports.editQuerstion = editQuerstion;
const dropQuestion = (id) => __awaiter(this, void 0, void 0, function* () {
    let StrQuery = `delete from pdd.questions where id = ${id}`;
    yield connection_1.client.query(StrQuery);
});
exports.dropQuestion = dropQuestion;
