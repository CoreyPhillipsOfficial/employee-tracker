-- Seed data for department
INSERT INTO department (department_name) VALUES ('IT'), ('HR'), ('Sales'), ('Finance');

-- Seed data for role
INSERT INTO role (title, salary, department_id) VALUES 
  ('Software Engineer', 80000, 1),
  ('HR Manager', 60000, 2),
  ('Sales Representative', 70000, 3),
  ('Financial Analyst', 75000, 4);

-- Seed data for employee
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Mike', 'Johnson', 3, 1),
  ('Laura', 'Lee', 4, 2);