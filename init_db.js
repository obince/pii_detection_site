const config = require("./config.js");
const mysql = require("mysql");
const db = mysql.createConnection({
    host     : config.HOST,
    user     : config.USER,
    password : config.PASSWORD,
    database : config.DATABASE,
    multipleStatements: true
});

async function main (){

    await db.connect((err)=> {
        if(!err)
        console.log('Connection Established Successfully');
        else
        console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
        });

    console.log("DB connection started.");

    console.log("Dropping tables.");
    await db.query('DROP TABLE IF EXISTS `SuspectForm`');
    await db.query('DROP TABLE IF EXISTS `DATE_TIME`');
    await db.query('DROP TABLE IF EXISTS `PERSON`');
    await db.query('DROP TABLE IF EXISTS `LOCATION`');
    await db.query('DROP TABLE IF EXISTS `EMAIL_ADDRESS`');
    await db.query('DROP TABLE IF EXISTS `DOMAIN_NAME`');
    await db.query('DROP TABLE IF EXISTS `US_DRIVER_LICENSE`');
    await db.query('DROP TABLE IF EXISTS `NRP`');
    await db.query('DROP TABLE IF EXISTS `US_PASSPORT`');
    await db.query('DROP TABLE IF EXISTS `US_SSN`');
    await db.query('DROP TABLE IF EXISTS `US_BANK_NUMBER`');
    await db.query('DROP TABLE IF EXISTS `UK_NHS`');
    await db.query('DROP TABLE IF EXISTS `PHONE_NUMBER`');
    await db.query('DROP TABLE IF EXISTS `IP_ADDRESS`');
    await db.query('DROP TABLE IF EXISTS `IBAN_CODE`');
    await db.query('DROP TABLE IF EXISTS `CREDIT_CARD`');
    await db.query('DROP TABLE IF EXISTS `US_ITIN`');

    console.log("Creating tables.");
    await db.query(
        `CREATE TABLE SuspectForm( 
        id INT AUTO_INCREMENT,
        form_id BIGINT UNSIGNED NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        status VARCHAR(16) NOT NULL DEFAULT 'TBD' CHECK (status IN ('TBD', 'NO', 'YES', 'MAYBE')),
        entities JSON NOT NULL,
        formWeight FLOAT NOT NULL,
        PRIMARY KEY (id),
        UNIQUE(form_id)
        );`
    );

    await db.query(
        `CREATE TABLE DATE_TIME(
        id INT AUTO_INCREMENT,
        _0_10 FLOAT NOT NULL,
        _0_20 FLOAT NOT NULL,
        _0_45 FLOAT NOT NULL,
        _0_55 FLOAT NOT NULL,
        _0_60 FLOAT NOT NULL,
        _0_85 FLOAT NOT NULL,
        _0_95 FLOAT NOT NULL,
        PRIMARY KEY (id)
        );`
    );

    await db.query(
        `CREATE TABLE PERSON(
        id INT AUTO_INCREMENT,
        _0_85 FLOAT NOT NULL,
        PRIMARY KEY (id)
        );`
    );

    await db.query(
        `CREATE TABLE LOCATION(
        id INT AUTO_INCREMENT,
        _0_85 FLOAT NOT NULL,
        PRIMARY KEY (id)
        );`
    );

    await db.query(
        `CREATE TABLE EMAIL_ADDRESS(
        id INT AUTO_INCREMENT,
        _1_00 FLOAT NOT NULL,
        PRIMARY KEY (id)
        );`
    );

    await db.query(
        `CREATE TABLE DOMAIN_NAME(
        id INT AUTO_INCREMENT,
        _1_00 FLOAT NOT NULL,
        PRIMARY KEY (id)
        );`
    );

    await db.query(
        `CREATE TABLE US_DRIVER_LICENSE(
        id INT AUTO_INCREMENT,
        _0_01 FLOAT NOT NULL,
        _0_30 FLOAT NOT NULL,
        _0_40 FLOAT NOT NULL,
        _0_65 FLOAT NOT NULL,
        PRIMARY KEY (id)
        );`
    );

    await db.query(
        `CREATE TABLE NRP(
        id INT AUTO_INCREMENT,
        _0_85 FLOAT NOT NULL,
        PRIMARY KEY (id)
        );`
    );

    await db.query(
        `CREATE TABLE US_PASSPORT(
        id INT AUTO_INCREMENT,
        _0_05 FLOAT NOT NULL,
        PRIMARY KEY (id)
        );`
    );

    await db.query(
        `CREATE TABLE US_SSN(
        id INT AUTO_INCREMENT,
        _0_05 FLOAT NOT NULL,
        _0_85 FLOAT NOT NULL,
        PRIMARY KEY (id)
        );`
    );

    await db.query(
        `CREATE TABLE US_BANK_NUMBER(
        id INT AUTO_INCREMENT,
        _0_05 FLOAT NOT NULL,
        _0_40 FLOAT NOT NULL,
        PRIMARY KEY (id)
        );`
    );

    await db.query(
        `CREATE TABLE UK_NHS(
        id INT AUTO_INCREMENT,
        _1_00 FLOAT NOT NULL,
        PRIMARY KEY (id)
        );`
    );

    await db.query(
        `CREATE TABLE PHONE_NUMBER(
        id INT AUTO_INCREMENT,
        _0_05 FLOAT NOT NULL,
        _0_40 FLOAT NOT NULL,
        _0_50 FLOAT NOT NULL,
        _0_70 FLOAT NOT NULL,
        _0_85 FLOAT NOT NULL,
        _1_00 FLOAT NOT NULL,
        PRIMARY KEY (id)
        );`
    );

    await db.query(
        `CREATE TABLE IP_ADDRESS(
        id INT AUTO_INCREMENT,
        _0_60 FLOAT NOT NULL,
        _0_95 FLOAT NOT NULL,
        PRIMARY KEY (id)
        );`
    );

    await db.query(
        `CREATE TABLE IBAN_CODE(
        id INT AUTO_INCREMENT,
        _1_00 FLOAT NOT NULL,
        PRIMARY KEY (id)
        );`
    );

    await db.query(
        `CREATE TABLE CREDIT_CARD(
        id INT AUTO_INCREMENT,
        _1_00 FLOAT NOT NULL,
        PRIMARY KEY (id)
        );`
    );

    await db.query(
        `CREATE TABLE US_ITIN(
        id INT AUTO_INCREMENT,
        _0_30 FLOAT NOT NULL,
        PRIMARY KEY (id)
        );`
    );

    console.log("DB tables are created.");

    console.log("Putting initial values to parameters.");

    await db.query(`INSERT INTO DATE_TIME(_0_10, _0_20, _0_45, _0_55, _0_60, _0_85, _0_95) VALUES (1, 1, 1, 1, 1, 1, 1);`);
    await db.query(`INSERT INTO PERSON(_0_85) VALUES (1);`);
    await db.query(`INSERT INTO LOCATION(_0_85) VALUES (1);`);
    await db.query(`INSERT INTO EMAIL_ADDRESS(_1_00) VALUES (1);`);
    await db.query(`INSERT INTO DOMAIN_NAME(_1_00) VALUES (1);`);
    await db.query(`INSERT INTO US_DRIVER_LICENSE(_0_01, _0_30, _0_40, _0_65) VALUES (1, 1, 1, 1);`);
    await db.query(`INSERT INTO NRP(_0_85) VALUES (1);`);
    await db.query(`INSERT INTO US_PASSPORT(_0_05) VALUES (1);`);
    await db.query(`INSERT INTO US_SSN(_0_05, _0_85) VALUES (1, 1);`);
    await db.query(`INSERT INTO US_BANK_NUMBER(_0_05, _0_40) VALUES (1, 1);`);
    await db.query(`INSERT INTO UK_NHS(_1_00) VALUES (1);`);
    await db.query(`INSERT INTO PHONE_NUMBER(_0_05, _0_40, _0_50, _0_70, _0_85, _1_00) VALUES (1, 1, 1, 1, 1, 1);`);
    await db.query(`INSERT INTO IP_ADDRESS(_0_60, _0_95) VALUES (1, 1);`);
    await db.query(`INSERT INTO IBAN_CODE(_1_00) VALUES (1);`);
    await db.query(`INSERT INTO CREDIT_CARD(_1_00) VALUES (1);`);
    await db.query(`INSERT INTO US_ITIN(_0_30) VALUES (1);`);



    console.log("DB connection finished.");
}

main().then(()=>db.end());