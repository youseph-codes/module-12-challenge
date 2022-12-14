DROP DATABASE IF EXISTS employeetracker;
CREATE DATABASE employeetracker;

USE employeetracker;

CREATE TABLE departments (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);

CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(30),
    lastName VARCHAR(30),
    rolesID INTEGER,
    FOREIGN KEY (rolesID) REFERENCES roles(id) ON DELETE CASCADE,
    managerID INTEGER NULL,
    FOREIGN KEY (managerID) REFERENCES employees(id) ON DELETE SET NULL
);

CREATE TABLE roles (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);