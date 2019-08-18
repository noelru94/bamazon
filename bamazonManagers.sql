USE bamazon;

CREATE TABLE managerLogins(
    manager_id AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    username VARCHAR(40) NOT NULL,
    password VARCHAR(40) NOT NULL
)