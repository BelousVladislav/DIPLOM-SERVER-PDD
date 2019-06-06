import { client } from '../connection';
import { QueryResult } from 'pg';
import { isUndefined } from 'util';

class image{
    id?:number;
    path: string;

    constructor(path: string, id?:number){
        this.id = id;
        this.path=path;
    }
}
let getImages = async(image_id?:number)=>{
    let res: QueryResult;
    let StrQuery: string = 'select id, image from pdd.images';
    let Images: image[] = [];
    res = await client.query(isUndefined(image_id)? StrQuery+' order by id asc' : StrQuery+` where id = ${image_id}`+' order by id asc');
    for(let i = 0; i<res.rows.length; i++){
        Images.push(
            new image(res.rows[i].image, res.rows[i].id)
        )
    }
    return Images;
}
let addImage = async(path: string)=>{
    await client.query(`insert into pdd.images (image) values('${path}')`)
}
let EditImage = async(editImage:image) => {
    await client.query(`update pdd.images set image = '${editImage.path}' where id = ${editImage.id}`)
}
let DropImage = async(id:number)=>{
    await client.query(`delete from pdd.images where id = ${id}`);
}
export{ image, addImage, EditImage, DropImage, getImages }