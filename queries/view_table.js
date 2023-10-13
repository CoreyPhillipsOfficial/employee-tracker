const db = require('../db/db');
require('console.table');

function viewDeparments() {
    db.query('select * from department', function (err, res) {
        err ? console.log(err) : console.table(res)
    });
};