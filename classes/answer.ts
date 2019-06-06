import { client } from '../connection';
import { QueryResult } from 'pg';
import { isUndefined } from 'util';

class answer{
    id?: number;
    name: string;
    question_id: number;
    f_right: boolean;

    constructor(name:string, question_id: number, f_right:boolean, id?:number){
        this.id = id;
        this.name = name;
        this.question_id = question_id;
        this.f_right = f_right;
    }
}
const getAnswers = async(question_id?:number) => {
    let StrQuery = 'select id, name, question_id, f_right from pdd.answers';
    let row: QueryResult;
    let answers: answer[]=[];
    row = await client.query(isUndefined(question_id)? StrQuery+' order by id asc' : StrQuery+` where question_id = ${question_id}`+' order by id asc');
    for(let i:number =0; i<row.rows.length; i++){
        answers.push(
            new answer(
                row.rows[i].name,
                row.rows[i].question_id,
                row.rows[i].f_right, 
                row.rows[i].id
            )
        )
    }
    return answers;
}
const addAnswer = async(newAnswer: answer) => {
    let StrQuery = `insert into pdd.answers(name, question_id, f_right) values(
        '${newAnswer.name}', ${newAnswer.question_id}, ${newAnswer.f_right})`;
    console.log(StrQuery)
        await client.query(StrQuery);    
}
const editAnswer = async(editAnswer: answer) => {
    let StrQuery = `update pdd.answers set 
                        name = '${editAnswer.name}', 
                        question_id= ${editAnswer.question_id}, 
                        f_right = ${editAnswer.f_right}
                    where id = ${editAnswer.id}`;
    await client.query(StrQuery);    
}
const dropAnswer = async(id:number) =>{
    let StrQuery = `delete from pdd.answers where id = ${id}`;
    await client.query(StrQuery);
}
export { answer, getAnswers, addAnswer, editAnswer, dropAnswer}