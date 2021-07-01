const mysql = require('mysql');
const config = require("./config");

class DB{
    constructor() {
        this._db = mysql.createConnection({
            host     : config.HOST,
            user     : config.USER,
            password : config.PASSWORD,
            database : config.DATABASE,
            multipleStatements: true
        });
        this._db.connect((err)=> {
            if(!err)
            console.log('Connection Established Successfully');
            else
            console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
            });
    }

    test(){
        this._db.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results[0].solution);
        });
    }

    getAllForms(){
        return new Promise(resolve=>{
            this._db.query(
                'SELECT * FROM SuspectForm',
                (error, results, fields)=>{
                    if(error){
                        console.log(error);
                        resolve(null);
                    }else{
                        console.log(results);
                        resolve(results);
                    }
                });
        });
    }

    createSuspectForm(form_id, entities, formWeight){
        const entity_str = JSON.stringify(entities);
        return new Promise(resolve=>{
            this._db.query('INSERT INTO SuspectForm(form_id, entities, formWeight) VALUES ?', [[[form_id, entity_str, formWeight]]], (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    }else{
                        resolve(results.insertId);
                    }
                }
            );
        });
    }

    getSuspectForm(fid) {
        return new Promise( resolve => {
            this._db.query(`SELECT * FROM SuspectForm WHERE form_id = ${fid}`,
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(null);
                    }else{
                        console.log(results[0]);
                        resolve(results[0]);
                    }
                });
        });
    }

    getEarliestSuspectForm() {
        return new Promise( resolve => {
            this._db.query(`SELECT * FROM SuspectForm WHERE status <> 'NO' AND status <> 'YES' ORDER BY id ASC LIMIT 1`,
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(null);
                    }else{
                        console.log(results[0]);
                        resolve(results[0]);
                    }
                });
        });
    }

    getMostWeightedSuspectForm() {
        return new Promise( resolve => {
            this._db.query(`SELECT * FROM SuspectForm WHERE status <> 'NO' AND status <> 'YES' ORDER BY formWeight DESC LIMIT 1`,
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(null);
                    }else{
                        console.log(results[0]);
                        resolve(results[0]);
                    }
                });
        });
    }

    getPreviousFormById(id) {
        return new Promise( resolve => {
            this._db.query(`SELECT * FROM SuspectForm WHERE id < ${id} AND status <> 'NO' AND status <> 'YES' ORDER BY id DESC LIMIT 1`,
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(null);
                    }else{
                        console.log(results[0]);
                        resolve(results[0]);
                    }
                });
        });
    }

    getPreviousFormByWeight(id) {
        return new Promise( resolve => {
            this._db.query(`SELECT * FROM SuspectForm WHERE id <> ${id} AND formWeight >= (SELECT formWeight FROM SuspectForm WHERE id = ${id}) 
                                                                        AND status <> 'NO' AND status <> 'YES' ORDER BY formWeight LIMIT 1`,
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(null);
                    }else{
                        console.log(results[0]);
                        resolve(results[0]);
                    }
                });
        });
    }

    getNextFormByWeight(id) {
        return new Promise( resolve => {
            this._db.query(`SELECT * FROM SuspectForm WHERE id <> ${id} AND formWeight <= (SELECT formWeight FROM SuspectForm WHERE id = ${id}) 
                                                                        AND status <> 'NO' AND status <> 'YES' ORDER BY formWeight DESC LIMIT 1`,
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(null);
                    }else{
                        console.log(results[0]);
                        resolve(results[0]);
                    }
                });
        });
    }

    getNextFormById(id) {
        return new Promise( resolve => {
            this._db.query(`SELECT * FROM SuspectForm WHERE id > ${id} AND status <> 'NO' AND status <> 'YES' ORDER BY id LIMIT 1`,
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(null);
                    }else{
                        console.log(results[0]);
                        resolve(results[0]);
                    }
                });
        });
    }

    updateEntityScoreWeight(type, score, value) {
        return new Promise( resolve => {
            this._db.query(
                `UPDATE ${type} SET ${score} = ${value} WHERE id = 1;`,
                (error, results, fields) => {
                    if(error) {
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }

    getEntityScoreWeight(type, score){
        return new Promise( resolve => {
           this._db.query(
               `SELECT ${score} FROM ${type} WHERE id = 1;`,
               (error, results, fields) => {
                   if(error) {
                       console.log(error);
                       resolve(null);
                   } else {
                       console.log(results[0]);
                       resolve(results[0]);
                   }
               }
           );
        });
    }

    updateSuspectFormStatus(id, status) {
        return new Promise( resolve => {
            this._db.query(
                `UPDATE SuspectForm
                 SET status = '${status}'
                 WHERE id = ${id};`,
                (error, results, fields) => {
                    if(error) {
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }

}

module.exports = new DB();