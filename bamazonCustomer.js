const inquirer = require('inquirer');
const mysql = require('mysql');
const connection = mysql.createConnection({
    port: 3306,
    user: 'root',
    password: 'Spring126',
    database: 'bamazon'
});

bamazon();

// when user runs the app a table will appear with 
//items and its info 'id#,product name,and price'
function bamazon (){
    connection.connect((err)=>{
        if(err) throw err;

        connection.query('SELECT item_id,product_name,price FROM products',(err,res)=>{
            if(err) throw err;
            console.log('Welcome to Bamazon\n-------------------------');
            console.table(res);
            promptUserForPurchase();
        })        
    })
}


var promptUserForPurchase = ()=>{
    inquirer.prompt([
        {
            message: 'Choose an ID number of the product you would like to buy',
            name: 'id'
        },
        {
            message: 'How many units of the product would you like to buy?',
            name: 'units'
        }
    ]).then((answers)=>{
        checkInventory(answers.id,answers.units);
    })
}


var checkInventory = (id,numOfUnitsUserWants)=>{
    console.log(`Connection id: ${connection.threadId}`);

    connection.query('SELECT stock_quantity FROM products WHERE item_id=?',[id],(err,res)=>{
        if(err) throw err;
        var itemQuantity = res[0].stock_quantity;
            
        if(itemQuantity > numOfUnitsUserWants){    
            placeOrder(itemQuantity,numOfUnitsUserWants,id);
        }else if(itemQuantity < units || itemQuantity === 0){
            console.log('Insufficient quantity!');
        }
    })      
}

var placeOrder = (numDatabase,numUserWants,id)=>{
    connection.query('UPDATE products SET stock_quantity = ? WHERE item_id=?',[numDatabase-numUserWants,id],function(err,res){
        if(err) throw err;
        console.log('order placed');
        console.log(`database updated`);

        total(numUserWants,id);
    })
}

var total = (numOfUnits,id)=>{
    connection.query('SELECT price FROM products WHERE item_id=?',[id],(err,res)=>{
        if(err) throw err;
        var unitPrice = res[0].price;
        var total = unitPrice * numOfUnits;
        console.log(`Your total comes out to ${total}`);

        connection.end();
    })
}