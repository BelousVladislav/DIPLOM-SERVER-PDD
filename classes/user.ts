import { client } from '../connection';
import { QueryResult } from 'pg';

export class user{
    public id: number;
    private _name: string;
    private _last_name: string;
    private _otchestvo: string;
    private _login: string;
    private _password: string;
    public is_admin: boolean;
    public user_add: number;
    public datachange: Date;
    constructor(name: string, last_name: string, otchestvo: string, login: string, password: string, id?: number, is_admin?: boolean, user_add?: number){
        if (id != undefined || id!=null){
            this.id = id;
        }
        this._name = name;
        this._last_name = last_name;
        this._otchestvo = otchestvo;
        this._login = login;
        this._password = password;
        if (is_admin != undefined || is_admin != null){
            this.is_admin = is_admin;
        }else this.is_admin = false;
        if (user_add != undefined || user_add != null){
            this.user_add = user_add;
        }else this.user_add = 1;
    }

    get name(){
        return this._name;
    }
    set name(value: string){
        this._name = value;
    }
    get last_name(){
        return this._last_name;
    }
    set last_name(value: string){
        this._last_name = value;
    }
    get otchestvo(){
        return this._otchestvo;
    }
    set otchestvo(value: string){
        this._otchestvo = value;
    }
    get login(){
        return this._login;
    }
    set login(value: string){
        this._login = value;
    }
    get password(){
        return this._password;
    }
    set password(value: string){
        this._password = value;
    }    
    static async getUser(id?: number){
        let users: user[]=[]; 
        let res:QueryResult;
        let strQuery: string = 'select id, name, last_name, otchestvo, login, password, is_admin, user_add from pdd.users'; 
        try{
            res = await client.query(id? strQuery+` where id = ${id}`: strQuery);
        }catch(err){
            console.log(err)
        }
            for (let i:number=0; i<res.rows.length; i++){
                users.push( new user(
                    res.rows[i].name,
                    res.rows[i].last_name,
                    res.rows[i].otchestvo,
                    res.rows[i].login,
                    res.rows[i].password,
                    res.rows[i].id,
                    res.rows[i].is_admin,
                    res.rows[i].user_add,
                    ));    
            }
                console.log('--------------------------------------------------');          
        return users;
    }
    static async getAutorizationUser(login: string, password: string){
        let logUser: user;
        let res: QueryResult;
        let strQuery: string;

        res = await client.query(`select id, name, last_name, otchestvo, login, password, is_admin, user_add from pdd.users where login = '${login}' and password = '${password}'`);
        if(res.rowCount>0){
            logUser = new user(
                res.rows[0].name,
                res.rows[0].last_name,
                res.rows[0].otchestvo,
                res.rows[0].login,
                res.rows[0].password,
                res.rows[0].id,
                res.rows[0].is_admin,
                res.rows[0].user_add,
            );
            console.log(JSON.stringify(logUser));
            return logUser;
        }else{
             let errObj = {error_code: 1, error_text:'User not found'};
             return errObj;
            
        }
    }
}

const dropUser = async (id: number) => {
    
}