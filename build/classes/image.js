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
class image {
    constructor(path, id) {
        this.id = id;
        this.path = path;
    }
}
exports.image = image;
let getImages = (image_id) => __awaiter(this, void 0, void 0, function* () {
    let res;
    let StrQuery = 'select id, image from pdd.images';
    let Images = [];
    res = yield connection_1.client.query(util_1.isUndefined(image_id) ? StrQuery + ' order by id asc' : StrQuery + ` where id = ${image_id}` + ' order by id asc');
    for (let i = 0; i < res.rows.length; i++) {
        Images.push(new image(res.rows[i].image, res.rows[i].id));
    }
    return Images;
});
exports.getImages = getImages;
let addImage = (path) => __awaiter(this, void 0, void 0, function* () {
    yield connection_1.client.query(`insert into pdd.images (image) values('${path}')`);
});
exports.addImage = addImage;
let EditImage = (editImage) => __awaiter(this, void 0, void 0, function* () {
    yield connection_1.client.query(`update pdd.images set image = '${editImage.path}' where id = ${editImage.id}`);
});
exports.EditImage = EditImage;
let DropImage = (id) => __awaiter(this, void 0, void 0, function* () {
    yield connection_1.client.query(`delete from pdd.images where id = ${id}`);
});
exports.DropImage = DropImage;
