import { client } from '../connection';
import { QueryResult } from 'pg';

class theme{
    id: number;
    name: string;
    min_balls?: number;
    datachange?: Date;
    user_add?: string;
    constructor(id: number, name: string, min_balls?: number, datachange?:Date,  user_add?: string){
        this.id = id;
        this.name = name;
        this.min_balls = min_balls;
        this.datachange = datachange;
        this.user_add = user_add;
    }
}
const getTheme = async()=>{
    let themes: theme[] = [];
    let res: QueryResult;
    try{
        res = await client.query(
    'select'+
        ' th.id, th.name themeName, th.min_balls, th.datachange, us.name userAddName'+
    ' from'+
        ' pdd.themes th'+
    ' join pdd.users us on us.id = th.user_add order by th.id asc');
    }catch(err){
        console.log(err)
    }
    console.log(res.rows);
    for(let i:number = 0; i<res.rows.length; i++){
        themes.push(new theme(
            res.rows[i].id,
            res.rows[i].themename,
            res.rows[i].min_balls,
            res.rows[i].datachange,
            res.rows[i].useraddname
        ))
    };
    return themes;
}
export { getTheme, theme }