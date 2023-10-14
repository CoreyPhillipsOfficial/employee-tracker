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
            choices: [{
                name: 'View All Departments',
                value: 'view_all_departments'
            },
            {
                name: 'View All Roles',
                value: 'view_all_roles'
            },
            {
                name: 'View All Employees',
                value: 'view_all_employees'
            },
            {
                name: 'Add Department',
                value: 'add_department'
            },
            {
                name: 'Add Role',
                value: 'add_role'
            },
            {
                name: 'Add Employee',
                value: 'add_employee'
            },
            {
                name: 'Update Employee',
                value: 'update_employee'
            },
            ],
        })
        .then((answer) => {
            let list = answer.choices
            switch (list) {
                case 'view_all_departments':
                    viewDepartments();
                    break;
                case 'view_all_roles':
                    viewRoles();
                    break;
                case 'view_all_employees':
                    viewEmployees();
                    break;
                case 'add_department':
                    addDepartment();
                    break;
                case 'add_role':
                    addRole();
                    break;
                case 'add_employee':
                    addEmployee();
                    break;
                case 'update_employee':
                    updateEmployee();
                    break;
            };
        })
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
};

function addRole() {
    db.query('select * from department', function (err, res) {
        if (err) {
            console.log('err')
            init()
        }
        const listDepartments = res.map((department) => ({
            value: department.department_id,
            name: department.department_name,
        }))
        inquirer.prompt([
            {
                type: 'list',
                name: 'department_list',
                message: 'What department will this role belong to?',
                choices: listDepartments

            },
            {
                type: 'input',
                name: 'role_name',
                message: 'What role would you like to add?'

            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of this role?'
            }
        ]).then((response) => {
            let departmentName = response.department_list;
            let roleName = response.role_name;
            let salary = response.salary;

            db.query(`insert into role (title, salary, department_id)
            values ('${roleName}', '${salary}', '${departmentName}')
            `, function (err, res) {
                err ? console.log(err) : viewRoles(), init()
            })
        })
    })
}

init();