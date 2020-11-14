const mysql = require('mysql');
const uuid = require('uuid');
const { v4 } = uuid;
const config = require('./config.json');
const pool = mysql.createPool({
    host: config.dbhost,
    user: config.dbuser,
    password: config.dbpassword,
    database: config.dbname,
    port: 3306,
});


const insertSQL = (room, coil) => {
    let uuid = v4();
    return "INSERT INTO `accenture`.`aircon_monitoring` (`key`, `room_temp`, `coil_temp`, `insert_datetime`) VALUES ('" + uuid + "','" + room + "','" + coil + "',  NOW());"
};

exports.handler = (event, context, callback) => {
    //prevent timeout from waiting event loop
    context.callbackWaitsForEmptyEventLoop = false;

    if (event.body !== null && event.body !== undefined) {
        let body =  JSON.parse(event.body);
        let { Room, Coil } = body.payload_fields;
         pool.getConnection((err, connection) => {
            connection.query(insertSQL(Room, Coil), (err, res) => {
                console.log(err);
                // console.log(res[0]);
                callback(null, "Success");
            });
        });
    }
};

