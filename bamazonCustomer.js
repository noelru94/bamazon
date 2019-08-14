const inquirer = require('inquirer');
const mysql = require('mysql');
const connection = mysql.createConnection({
    port: 3306,
    user: 'root',
    password: 'Spring126',
    database: 'bamazon'
});

showItems();

// when user runs the app a table will appear with 
//items and its info 'id#,product name, and price'
function showItems(){
    
    connection.connect(function(err){
        if(err) throw err;
        console.log(`Connection id: ${connection.threadId}\n-------------------------` );

        connection.query('SELECT item_id,product_name,price FROM products',function(err,res){
            if(err) throw err;
            console.log('Welcome to Bamazon\n-------------------------');
            console.table(res);
            promptUser();
        })

        connection.end();
        
    })
}

//
function promptUser(){
    inquirer.prompt([
        {
            message: 'Choose an ID of the product you would like to buy',
            name: 'id'
        },
        {
            message: 'How many units of the product would you like to buy?',
            name: 'units'
        }
    ]).then(function(answers){
        console.log(answers.id,answers.units);
    })
}


function checkInventory(id,units){
    connection
}