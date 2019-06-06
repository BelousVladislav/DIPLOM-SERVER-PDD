import { client } from '../connection';
import { QueryResult } from 'pg';
import { isUndefined } from 'util';

class question{
    id?: number;
    name: string;
    task_id: number;
    image_id?: number;

    constructor(name:string, task_id: number, id?: number, image_id?: number){
        this.id = id;
        this.name = name;
        this.task_id = task_id;
        this.image_id = image_id;
    }
}
const getQestions = async(task_id?:number) => {
    let StrQuery = 'select id, name, image_id, task_id from pdd.questions';
    let row: QueryResult;
    let questions: question[]=[];
    row = await client.query(isUndefined(task_id)? StrQuery+' order by id asc' : StrQuery+` where task_id = ${task_id}`+' order by id asc');
    for(let i:number =0; i<row.rows.length; i++){
        questions.push(
            new question(
                row.rows[i].name,
                row.rows[i].task_id,
                row.rows[i].id, 
                row.rows[i].image_id,
            )
        )
    }
    return questions;
}
const addQuerstion = async(newQuestion: question) => {
    let StrQuery = `insert into pdd.questions(name, task_id, image_id) values(
        '${newQuestion.name}', ${newQuestion.task_id}, ${isUndefined(newQuestion.image_id)? null: newQuestion.image_id})`;
    await client.query(StrQuery);    
}
const editQuerstion = async(editQuestion: question) => {
    let StrQuery = `update pdd.questions set 
                        name = '${editQuestion.name}', 
                        task_id= ${editQuestion.task_id}, 
                        image_id = ${isUndefined(editQuestion.image_id)? null: editQuestion.image_id}
                    where id = ${editQuestion.id}`;
    await client.query(StrQuery);    
}
const dropQuestion = async(id:number) =>{
    let StrQuery = `delete from pdd.questions where id = ${id}`;
    await client.query(StrQuery);
}
export { question, getQestions, addQuerstion, editQuerstion, dropQuestion }