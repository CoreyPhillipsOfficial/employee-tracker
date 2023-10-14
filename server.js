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
    db.query(`
    SELECT r.role_id AS ID, r.title, d.department_name AS Department, r.salary
    FROM role r
    INNER JOIN department d ON r.department_id = d.department_id
    `, function (err, res) {
        if (err) {
            console.log(err)
            return;
        }
        console.table(res);
        init();
    });
};

function viewEmployees() {
    db.query(`
    SELECT e.employee_id, e.first_name, e.last_name, r.title AS role, r.salary,
    d.department_name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e
    INNER JOIN role r ON e.role_id = r.role_id
    INNER JOIN department d ON r.department_id = d.department_id
    LEFT JOIN employee m ON e.manager_id = m.employee_id
    `, function (err, res) {
        if (err) {
            console.log(err)
            return;
        }
        const formattedData = res.map(employee => ({
            'Employee ID': employee.employee_id,
            'First Name': employee.first_name,
            'Last Name': employee.last_name,
            'Role': employee.role,
            'Salary': employee.salary,
            'Department': employee.department,
            'Manager': employee.manager
        }))
        console.table(formattedData);
        init();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'add_department',
            message: 'Enter department name'
        }
    ]).then((response) => {
        let departmentName = response.add_department
        db.query(`INSERT INTO department (department_name) VALUES
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
            init();
            return;
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

            db.query(`INSERT INTO role (title, salary, department_id)
            values ('${roleName}', '${salary}', '${departmentName}')
            `, function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    viewRoles();
                }
                init();
            })
        })
    })
}

function addEmployee() {
    db.query('select * from role', function (err, res) {
        if (err) {
            console.log('err')
            init();
            return;
        }
        const listRoles = res.map((role) => ({
            value: role.role_id,
            name: role.title,
        }))
        db.query('select * from employee where manager_id is null', function (err, res) {
            if (err) {
                console.log('err')
                init();
                return;
            }
            const listManagers = res.map((manager) => ({
                value: manager.employee_id,
                name: `${manager.first_name} ${manager.last_name}`,
            }))
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'What is the employee\'s first name?'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'What is the employee\'s last name?'
                },
                {
                    type: 'list',
                    name: 'role_list',
                    message: 'What is the employee\'s role?',
                    choices: listRoles
                },
                {
                    type: 'list',
                    name: 'manager_list',
                    message: 'Who is the employee\'s manager?',
                    choices: listManagers
                },
            ]).then((response) => {
                let firstName = response.first_name;
                let lastName = response.last_name;
                let roleName = response.role_list;
                let managerId = response.manager_list;

                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ('${firstName}','${lastName}','${roleName}','${managerId}')
                `, function (err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        viewEmployees();
                    }
                    init();
                })
            })
        })
    })
}

function updateEmployee() {
    db.query('select * from employee', function (err, res) {
        if (err) {
            console.log('err')
            init()
        }
        const listEmployees = res.map((employee) => ({
            value: employee.employee_id,
            name: `${employee.first_name} ${employee.last_name}`,
        }))
        db.query('select * from role', function (err, res) {
            if (err) {
                console.log('err')
                init()
            }
            const listRoles = res.map((role) => ({
                value: role.role_id,
                name: role.title,
            }))
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_list',
                    message: 'Which employee\'s role would you like to update?',
                    choices: listEmployees,
                },
                {
                    type: 'list',
                    name: 'role_list',
                    message: 'Which role do you want to assign the selected employee?',
                    choices: listRoles,
                },
            ]).then((response) => {
                let employeeId = response.employee_list;
                let roleId = response.role_list;

                db.query(`
                UPDATE employee
                SET role_id = '${roleId}'
                WHERE employee_id = '${employeeId}'
                `, function (err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        viewEmployees();
                    }
                    init();
                })
            })
        })
    })
}

init();