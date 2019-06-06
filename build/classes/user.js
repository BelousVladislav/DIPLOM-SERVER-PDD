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
class user {
    constructor(name, last_name, otchestvo, login, password, id, is_admin, user_add) {
        if (id != undefined || id != null) {
            this.id = id;
        }
        this._name = name;
        this._last_name = last_name;
        this._otchestvo = otchestvo;
        this._login = login;
        this._password = password;
        if (is_admin != undefined || is_admin != null) {
            this.is_admin = is_admin;
        }
        else
            this.is_admin = false;
        if (user_add != undefined || user_add != null) {
            this.user_add = user_add;
        }
        else
            this.user_add = 1;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get last_name() {
        return this._last_name;
    }
    set last_name(value) {
        this._last_name = value;
    }
    get otchestvo() {
        return this._otchestvo;
    }
    set otchestvo(value) {
        this._otchestvo = value;
    }
    get login() {
        return this._login;
    }
    set login(value) {
        this._login = value;
    }
    get password() {
        return this._password;
    }
    set password(value) {
        this._password = value;
    }
    static getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = [];
            let res;
            let strQuery = 'select id, name, last_name, otchestvo, login, password, is_admin, user_add from pdd.users';
            try {
                res = yield connection_1.client.query(id ? strQuery + ` where id = ${id}` : strQuery);
            }
            catch (err) {
                console.log(err);
            }
            for (let i = 0; i < res.rows.length; i++) {
                users.push(new user(res.rows[i].name, res.rows[i].last_name, res.rows[i].otchestvo, res.rows[i].login, res.rows[i].password, res.rows[i].id, res.rows[i].is_admin, res.rows[i].user_add));
            }
            console.log('--------------------------------------------------');
            return users;
        });
    }
    static getAutorizationUser(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let logUser;
            let res;
            let strQuery;
            res = yield connection_1.client.query(`select id, name, last_name, otchestvo, login, password, is_admin, user_add from pdd.users where login = '${login}' and password = '${password}'`);
            if (res.rowCount > 0) {
                logUser = new user(res.rows[0].name, res.rows[0].last_name, res.rows[0].otchestvo, res.rows[0].login, res.rows[0].password, res.rows[0].id, res.rows[0].is_admin, res.rows[0].user_add);
                console.log(JSON.stringify(logUser));
                return logUser;
            }
            else {
                let errObj = { error_code: 1, error_text: 'User not found' };
                return errObj;
            }
        });
    }
}
exports.user = user;
const dropUser = (id) => __awaiter(this, void 0, void 0, function* () {
});
