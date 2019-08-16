const mysql = require('mysql');
const inquirer = require('inquirer');
const connection = mysql.createConnection({
    port: 3306,
    user: 'root',
    password: 'Spring126',
    database: 'bamazon'
});

ManagerPortal();

function ManagerPortal(){
    connection.connect((err)=>{
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

// watch connection.end
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
    connection.query('SELECT item_id,product_name,price From products WHERE stock_quantity < ?',['5'],(err,data)=>{
        if(err) throw err;

        console.table(data);
    })
    connection.end();
}

let addToInventory = ()=> {
    console.log('add to inventory');
    connection.query('SELECT item_id,product_name,price,stock_quantity From products',(err,data)=>{
        if(err) throw err;
        console.table(data);
    
        inquirer.prompt([
            {
                type: 'number',
                message:'Which product would you like to add inventory too?',
                name: 'itemId'
            },
            {
                type: 'number',
                message: 'Add quantity to inventory',
                name: 'quantity'
            }
        ]).then((answer)=>{
        
            var newInventoryTotal = data[answer.itemId-1].stock_quantity + answer.quantity;

            connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?',[newInventoryTotal,answer.itemId],(err,data)=>{
                if(err) throw err;
                connection.end();
            })
        })
    });
}

let addNewProduct = ()=> {
    console.log('add new product');
    connection.query('SELECT item_id,product_name,price,stock_quantity From products',(err,data)=>{
        if(err) throw err;
        console.table(data);

        inquirer.prompt([
            {
                input: 'number',
                message: 'input ID number',
                name: 'item_id'
            },
            {
                message: 'Name of item',
                name:'product_name'
            },
            {
                message: 'Department name',
                name: 'department'
            },
            {
                input: 'number',
                message: 'Price of item',
                name: 'price'
            },
            {
                input: 'number',
                message: 'Stock quantity',
                name:'stock_quantity'
            }
        ]).then((answer)=>{
            connection.query('INSERT INTO products(item_id,product_name,department_name,price,stock_quantity)Values(?,?,?,?,?)',
            [answer.item_id,answer.product_name,answer.department,answer.price,answer.stock_quantity],(err)=>{
                if(err) throw err;
                connection.end();
            })
        })
    })
}