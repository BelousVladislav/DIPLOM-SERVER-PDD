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
class answer {
    constructor(name, question_id, f_right, id) {
        this.id = id;
        this.name = name;
        this.question_id = question_id;
        this.f_right = f_right;
    }
}
exports.answer = answer;
const getAnswers = (question_id) => __awaiter(this, void 0, void 0, function* () {
    let StrQuery = 'select id, name, question_id, f_right from pdd.answers';
    let row;
    let answers = [];
    row = yield connection_1.client.query(util_1.isUndefined(question_id) ? StrQuery + ' order by id asc' : StrQuery + ` where question_id = ${question_id}` + ' order by id asc');
    for (let i = 0; i < row.rows.length; i++) {
        answers.push(new answer(row.rows[i].name, row.rows[i].question_id, row.rows[i].f_right, row.rows[i].id));
    }
    return answers;
});
exports.getAnswers = getAnswers;
const addAnswer = (newAnswer) => __awaiter(this, void 0, void 0, function* () {
    let StrQuery = `insert into pdd.answers(name, question_id, f_right) values(
        '${newAnswer.name}', ${newAnswer.question_id}, ${newAnswer.f_right})`;
    console.log(StrQuery);
    yield connection_1.client.query(StrQuery);
});
exports.addAnswer = addAnswer;
const editAnswer = (editAnswer) => __awaiter(this, void 0, void 0, function* () {
    let StrQuery = `update pdd.answers set 
                        name = '${editAnswer.name}', 
                        question_id= ${editAnswer.question_id}, 
                        f_right = ${editAnswer.f_right}
                    where id = ${editAnswer.id}`;
    yield connection_1.client.query(StrQuery);
});
exports.editAnswer = editAnswer;
const dropAnswer = (id) => __awaiter(this, void 0, void 0, function* () {
    let StrQuery = `delete from pdd.answers where id = ${id}`;
    yield connection_1.client.query(StrQuery);
});
exports.dropAnswer = dropAnswer;
