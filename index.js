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
}