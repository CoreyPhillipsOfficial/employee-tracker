const inquirer = require('inquire');
const db = require('../db/db');

function addDepartment() {
    inquirer
        .prompt({
            name: 'department',
            message: 'What is the name of the department?'
        }).then((answers) => {
            const { department } = answers;
            const sql = 'INSERT INTO departments (name) VALUES (?)';
            const params = [department];

            db.query(sql, params, (err, results) => {
                if (err) console.log(`Successfully added ${department} to the database`);
            });
            mainMenu();
        });
};

module.exports = addDepartment;