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
class theme {
    constructor(id, name, min_balls, datachange, user_add) {
        this.id = id;
        this.name = name;
        this.min_balls = min_balls;
        this.datachange = datachange;
        this.user_add = user_add;
    }
}
exports.theme = theme;
const getTheme = () => __awaiter(this, void 0, void 0, function* () {
    let themes = [];
    let res;
    try {
        res = yield connection_1.client.query('select' +
            ' th.id, th.name themeName, th.min_balls, th.datachange, us.name userAddName' +
            ' from' +
            ' pdd.themes th' +
            ' join pdd.users us on us.id = th.user_add order by th.id asc');
    }
    catch (err) {
        console.log(err);
    }
    console.log(res.rows);
    for (let i = 0; i < res.rows.length; i++) {
        themes.push(new theme(res.rows[i].id, res.rows[i].themename, res.rows[i].min_balls, res.rows[i].datachange, res.rows[i].useraddname));
    }
    ;
    return themes;
});
exports.getTheme = getTheme;
