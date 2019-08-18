USE bamazon;

CREATE TABLE departments(
    department_id INTEGER AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL,
    over_head_costs INTEGER(10) NOT NULL,
    product_sales INTEGER(10) NOT NULL,
    total_profit INTEGER(10),
);

