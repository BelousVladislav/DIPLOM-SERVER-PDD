"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const conSrting = 'postgres://jpuveeijxuhrdu:48428a0c9c7ce31445259fa81a531e081e196b9e77e7f5677103551869a788fe@ec2-54-75-238-138.eu-west-1.compute.amazonaws.com:5432/dbg6jp4fjts3fj?ssl=true';
var client = new pg_1.Client(conSrting);
exports.client = client;
var connect = client.connect();
exports.connect = connect;
