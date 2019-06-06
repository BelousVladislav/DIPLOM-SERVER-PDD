import { client } from '../connection';
import { QueryResult } from 'pg';

class task{
    id?: number;
    name: string;
    text: string;
    theme_id: number;
    datachange: Date;
    image_id?: number;

    constructor(name: string, text: string, theme_id: number, id?: number,  datachange?: Date, image_id?: number){
        this.id = id;
        this.name = name;
        this.text = text;
        this.theme_id = theme_id;
        this.datachange = datachange;
        this.image_id = image_id;
    }
}
const GetTasks = async(theme_id?:number) => {
    let StrQuery = 'select id, name, text, theme_id, datachange, image_id from pdd.tasks';
    let tasks: task[] = [];
        let row: QueryResult = await client.query(theme_id == undefined? StrQuery+' order by id asc': StrQuery+` where theme_id = ${theme_id}`+' order by id asc')
        for (let i=0; i<row.rows.length; i++){
            tasks.push(
                new task(
                    row.rows[i].name,
                    row.rows[i].text,
                    row.rows[i].theme_id,
                    row.rows[i].id,
                    row.rows[i].datachange,
                    row.rows[i].image_id
                )
            )
        }
        return tasks;
}   
const AddTask = async(newTask: task) =>{
    let qrString = `insert into pdd.tasks(name, text, theme_id, image_id) values(
        '${newTask.name}',
        '${newTask.text}',
        ${newTask.theme_id},
        ${!isNaN(newTask.image_id)? newTask.image_id: 'null'}
    )`;
    console.log(qrString);
    await client.query(qrString);
}

const EditTask = async(editTask: task) => {
    let qrString = `update pdd.tasks set 
            name = '${editTask.name}', 
            text = '${editTask.text}',
            theme_id = ${editTask.theme_id},
            image_id = ${!isNaN(editTask.image_id)? editTask.image_id: 'null'}
            where id = ${editTask.id}`;
    console.log(qrString)
    await client.query(qrString);
};
const DropTask = async(id: number) => {
    await client.query(`delete from pdd.tasks where id = ${id}`);
};    

export { task, GetTasks, AddTask, EditTask, DropTask }