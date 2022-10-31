const express = require('express');
const db = require('./connection/connection')
const apiRoutes = require('');
const { default: inquirer } = require('inquirer');

const menuQuestions = [
    {
        type: 'list',
        name: 'answer',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee',
        ],
    },
];

// viewing functions of departments, roles, and employees
function viewDepartments() {
    db.promise()
    .query('SELECT departments.id, departments.department_name FROM departments;')
    .then((departments) => {
        console.table(departments[0]);
        menuQuestions();
    });
}

function viewRoles() {
    db.promise()
    .query('SELECT roles.id, roles.title, roles.salary, departments.department_name as department FROM roles LEFT JOIN departments on roles.department_id=departments.id;')
    .then((roles) => {
        console.table(roles[0]);
        menuQuestions();
    });
}

function viewEmployees() {
    db.promise()
    .query('SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.department_name FROM employees LEFT JOIN roles on roles.id=employees.roles_id LEFT JOIN departments.id=roles.department_id;')
    .then((employees) => {
        console.table(employees[0]);
        menuQuestions();
    });
}

// adding functions of departments, roles, and employees

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDepartment',
            message: 'Department name?',
        }
    ]).then(answer => {
        db.query('INSERT INTO departments SET?', { department_name: answer.newDepartment }, (err, res) => {
            menuQuestions();
        });
    });
}

function addRole () {
    db.promise().query('SELECT * FROM departments')
    .then((res) => {
        return res[0].map(departments => {
            return {
                name: departments.departments_name,
                value: departments.id
            }
        })
    })
    .then((departments) => {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'role',
                message: 'What role would you like to add?'
            },
            {
                type: 'input',
                name: 'role',
                message: 'What is the salary for this role?'
            },
            {
                type: 'list',
                name: 'department',
                choices: departments,
                messages: 'What department is this role in?'
            }
        ])
    })
    .then(answer => {
        return db.promise().query('INSERT INTO roles SET ?', { title: answer.role, salary: answer.salary, department_id: answers.department });
    })
    .then(res => {
        console.log('A new role has been added')
        menuQuestions();
    });
}

async function addEmployee() {
    const managers = await selectManager();
    inquirer.prompt([
        {
            type: 'input',
            name: 'first name',
            message: 'What is the first name of the employee being added?'
        },
        {
            type: 'input',
            name: 'last name',
            message: 'What is the last name of the employee being added?'
        },
        {
            type: 'list',
            name: 'role',
            choices: await selectRole(),
            message: 'What is their role?'
        },
        {
            type: 'list',
            name: 'manager',
            choices: managers,
            message: 'Who is their manager?'
        }
    ]).then(function (res) {
        let roleID = res.role
        let managerID = res.manager

        db.query('INSERT INTO employees SET ?',
        {
            firstName: res.firstName,
            lastName: res.lastName,
            managerID: res.managerID,
            roleID: res.roleID,
        },
        function (err) {
            menuQuestions();
        })
    })
}

async function updateEmployees() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'select',
            choices: await selectEmployee(),
            message: 'Who would you like to update?'
        },
        {
            type: 'list',
            name: 'assign',
            choices: await selectRole(),
            message: 'What role is being assigned to this employee?'
        },
    ]).then(function (res) {
        let employeeName = res.select
        let employeeRole = res.assign

        db.query('INSERT INTO employee SET ?',
        {
            ID: employeeName,
            rolesID: employeeRole,
        },
        function (err) {
            menuQuestions();
        })
    })
}