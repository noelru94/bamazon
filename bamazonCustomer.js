const inquirer = require('inquirer');
const mysql = require('mysql');
const connection = mysql.createConnection({
    port: 3306,
    user: 'root',
    password: 'Spring126',
    database: 'bamazon'
});

WelcomToBamazon();

function WelcomToBamazon (){
    connection.connect((err)=>{
        if(err) throw err;

        connection.query('SELECT item_id,product_name,price FROM products',(err,res)=>{
            if(err) throw err;
            console.table(res);
            promptUserForPurchase();
        })        
    })
}


var promptUserForPurchase = ()=>{
    inquirer.prompt([
        {
            type: 'number',
            message: 'Choose an ID number of the product you would like to buy',
            name: 'itemId'
        },
        {
            message: 'How many units of the product would you like to buy?',
            name: 'quantity'
        }
    ]).then((answers)=>{
        checkInventory(answers.itemId,answers.quantity);
    })
}


var checkInventory = (itemId,quantity)=>{
    connection.query('SELECT stock_quantity FROM products WHERE item_id=?',[itemId],(err,res)=>{
        if(err) throw err;
        var quantityInDatabase = res[0].stock_quantity;
            
        if(quantityInDatabase > quantity){    

            placeOrder(quantityInDatabase,quantity,itemId);

        }else if(quantityInDatabase < units || quantityInDatabase === 0){

            console.log('Insufficient quantity!');

        }
    })      
}

var placeOrder = (quantityInDatabase,quantity,itemId)=>{
    connection.query('UPDATE products SET stock_quantity = ? WHERE item_id=?',[quantityInDatabase-quantity,itemId],function(err){
        if(err) throw err;
        
        total(quantity,itemId);
    })
}

var total = (quantity,itemId)=>{
    connection.query('SELECT price FROM products WHERE item_id=?',[itemId],(err,res)=>{
        if(err) throw err;

        var unitPrice = res[0].price;
        var total = unitPrice * quantity;
        console.log(`Your total comes out to ${total}`);

        connection.end();
    })
}