const fs = require("fs");
const initSqlJs = require("sql.js");
// const initSqlJs = require('sql-wasm.js');
const filebuffer = fs.readFileSync(
  process.cwd() + "/scripts/sql/contract_event.db"
);

const DELETE = (id) => `DELETE FROM event_data WHERE id = ${id}`;
const SELECT_ALL = `SELECT * FROM event_data`;

const insertEventData = (tokenId, owner, from) => {
  initSqlJs().then((SQL) => {
    const db = new SQL.Database(filebuffer);
    
    let sqlstr = "INSERT INTO event_data VALUES (null, '"+tokenId+"', '"+owner+"', '"+from+"');"

    db.run(sqlstr);

    const res = db.exec(SELECT_ALL);
    console.log(res[0].values);
  });
};


module.exports = { insertEventData};
