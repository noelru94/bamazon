const mysql = require('mysql');
const inquirer = require('inquirer');

let connection = mysql.createConnection({
    port: 3306,
    user: 'root',
    password: 'Spring126',
    database: 'bamazon'
})

supervisor();
let supervisor = ()=>{
    connection.connect((err)=>{
        if(err) throw err;
   
        inquirer.prompt([
            {
                type: 'list',
                message: 'Supervisor Menu',
                choices: ['View Product Sales by Department','Create New Department'],
                name: 'menuOption'
            }
        ]).then((answer)=>{

            switch(answer.menuOption){
                case 'View Product Sales by Department':
                viewProductSalesByDepartment();
                break;

                case 'Create New Department':
                createNewDepartment();
                break;
            }
        })
    })
}


var viewProductSalesByDepartment = ()=>{
    console.log('sales');
    connection.query('')
}

var createNewDepartment = ()=>{
    console.log('new department');
}