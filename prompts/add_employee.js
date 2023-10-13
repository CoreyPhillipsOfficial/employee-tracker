const inquirer = require('inquire');
const db = require('../db/db');

function addEmployee() {
    inquirer
        .prompt({
            type: 'input',
            name: 'employee first name',
            message: 'What is the employee\'s first name?'
        },
            {
                type: 'input',
                name: 'employee last name',
                message: 'What is the employee\'s last name?'
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is the employee\'s role?',
                choices: ['role'] // Show all roles from database
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Who is the emplyee\'s manager?',
                choices: ['manager'] // Show managers

            }).then((answers) => {
                const { department } = answers;
                const sql = 'INSERT INTO departments (name) VALUES (?)';
                const params = [department];

                db.query(sql, params, (err, results) => {
                    if (err) console.log(`Successfully added ${department} to the database`);
                });
                mainMenu();
            });
}