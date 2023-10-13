const fs = require('fs');
const inquirer = require('inquirer');
// const { addDepartment, addRole, addEmployee, updateEmployee } = require('./prompts');
// const { viewTable } = require('./queries');
const db = require('./db/db');

function init() {
    menu();
}

function menu() {
    inquirer
        .prompt({
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            // make into object
            // {
            //     name: "View All Employees",
            //     value: "VIEW_EMPLOYEES"
            //   },
            choices: ['View all departments', 'View all roles', 'View all employees', 'add_department', 'Add a role', 'Add an employee', 'Update an employee role\n']
        }).then((answer) => {
            let list = answer.choices
            switch (list) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'add_department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployee();
                    break;
            };
        });
};

function viewDepartments() {
    db.query('select * from department', function (err, res) {
        err ? console.log(err) : console.table(res), init()
    });
};

function viewRoles() {
    db.query('select * from role', function (err, res) {
        err ? console.log(err) : console.table(res), init()
    });
};

function viewEmployees() {
    db.query('select * from employee', function (err, res) {
        err ? console.log(err) : console.table(res), init()
    });
};

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'add_department',
            message: 'Enter department name'
        }
    ]).then((response) => {
        let departmentName = response.add_department
        db.query(`insert into department (department_name) values
        ('${departmentName}')
        `, function (err, res) {
            err ? console.log(err) : viewDepartments(), init()
        })
    })
}

init();