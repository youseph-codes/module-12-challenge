const express = require('express');
const db = require('./connection/connection')
const apiRoutes = require('')

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
    })
}

function viewEmployees() {
    db.promise()
}