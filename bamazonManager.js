const mysql = require('mysql');
const inquirer = require('inquirer');
const connection = mysql.createConnection({
    port: 3306,
    user: 'root',
    password: 'Spring126',
    database: 'bamazon'
});

Manager();

function Manager(){
    connection.connect(function(err){
        if(err) throw err;
        console.log('connection id: ' + connection.threadId);

        inquirer.prompt([
            {
                type: 'list',
                message: 'Menu Options',
                choices: ['View Products for Sale','View Low Inventory','Add to Inventory','Add New Product'],
                name: 'manager'
            }
        ]).then((answer)=>{

            switch(answer.manager){
                case 'View Products for Sale':
                viewProducts();
                break;

                case 'View Low Inventory':
                viewLowInventory();
                break;

                case 'Add to Inventory':
                addToInventory();
                break;

                case 'Add New Product':
                addNewProduct();
                break;
            }
        })
    })
}
let viewProducts = ()=> {
    console.log('view products window');
    connection.query('SELECT item_id,product_name,price,stock_quantity From products',(err,data)=>{
        if(err) throw err;

        console.table(data);
    })
    connection.end();
}

let viewLowInventory = ()=> {
    console.log('view low inventory window');

    connection.end();
}

let addToInventory = ()=> {
    console.log('add to inventory');

    connection.end();
}

let addNewProduct = ()=> {
    console.log('add new product');

    connection.end();
}