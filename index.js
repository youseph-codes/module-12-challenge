// const express = require('express');
const db = require('./connection/connection')
// const apiRoutes = require('');
// const { default: inquirer } = require('inquirer');

const mysql = require("mysql2");
const inquirer = require("inquirer");
// const consoleTbl = require("console.table");



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
        menuQuestion();
    });
}

function viewRoles() {
    db.promise()
    .query('SELECT roles.id, roles.title, roles.salary, departments.department_name as department FROM roles LEFT JOIN departments on roles.department_id=departments.id;')
    .then((roles) => {
        console.table(roles[0]);
        menuQuestion();
    });
}

function viewEmployees() {
    db.promise()
    .query('SELECT employees.id, employees.firstName, employees.lastName, roles.title, roles.salary, departments.department_name FROM employees LEFT JOIN roles on roles.id=employees.rolesID LEFT JOIN departments on departments.id=roles.department_id;')
    .then((employees) => {
        console.table(employees[0]);
        menuQuestion();
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
            menuQuestion();
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
                name: 'salary',
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
        menuQuestion();
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
            menuQuestion();
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
            menuQuestion();
        })
    })
}

function selectManager() {
    return db.promise().query('SELECT * FROM employees')
    .then(res => {
        return res[0].map(employees => {
            return {
                name: `${employees.firstName} ${employees.lastName}`,
                value: employees.rolesID,
            };
        })
    })
}

function selectRole() {
    return db.promise().query('SELECT * FROM roles')
    .then(res => {
        return res[0].map(role => {
            return {
                name: role.title,
                value: role.id,
            };
        })
    })
}

function menuQuestion() {
    inquirer.prompt(menuQuestions).then((answers) => {
        console.log(answers.answer);
        switch (answers.answer) {
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "View all employees":
                viewEmployees();
                break;

            default:
            break;
        }
    });
}



menuQuestion();