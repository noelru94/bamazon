const inquirer = require('inquirer');
const mysql = require('mysql');
const connection = mysql.createConnection({
    port: 3306,
    user: 'root',
    password: 'Spring126',
    database: 'bamazon'
});
let total = 0;

WelcomeToBamazon();

function WelcomeToBamazon(){
    connection.query('SELECT item_id,product_name,price FROM products',(err,res)=>{
        if(err) throw err;
        console.table(res);
    
        inquirer.prompt([
            {
                type: 'list',
                message: 'Welcome to Bamazon! Would like to place an order',
                choices: ['Yes','No'],
                name: 'confirm'
            }
        ]).then((answer)=>{
                if (answer.confirm === 'Yes'){

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

                        connection.query('SELECT * FROM products WHERE item_id=?',[answers.itemId],(err,data)=>{
                            let item = data[0].product_name;
                            let itemId = data[0].item_id;
                            let numOfItems = answers.quantity;

                            inquirer.prompt([
                                {
                                    type: 'list',
                                    message: `Are you sure you want to add ${numOfItems} ${item}s to your cart?`,
                                    choices: ['Yes','No'],
                                    name:'confirm'
                                }
                            ]).then((answers)=>{
                                if(answers.confirm === 'Yes'){
                                    checkInventory(itemId,numOfItems);
                                }else{
                                    promptContinueShopping();
                                }
                            })
                        })
                    })
                }else{
                    console.log(`----------------------------------------------------------------------------`);
                    console.log('Thank You for shopping at Bamazon, come again');
                    console.log(`----------------------------------------------------------------------------`);
                    connection.end();
                }
        })
    })
}


let checkInventory = (itemId,quantity)=>{
    connection.query('SELECT * FROM products WHERE item_id=?',[itemId],(err,res)=>{
        if(err) throw err;
        let quantityInDatabase = res[0].stock_quantity;
        let productName = res[0].product_name;
            
        if(quantityInDatabase > quantity){    

            addItemToCart(quantityInDatabase,quantity,res[0].item_id);
        
        // if we have items in the inventory we but not enough to fullfill the order the customer is asked 
        // if they would like what left in the inventory
        }else if(quantityInDatabase < quantity && quantityInDatabase > 0){
            
            inquirer.prompt([
                {
                    type: 'list',
                    message: `Sorry we only have ${quantityInDatabase} ${res[0].product_name}s remaining in our inventory.\nDo you want to add the remaining inventory to your cart?`,
                    choices: ['Yes','No'],
                    name: 'confirm'
                }
            ]).then((answer)=>{
                // will add whats left in the inventory to customers cart
                if(answer.confirm === 'Yes'){
                    addItemToCart(quantityInDatabase,quantityInDatabase,res[0].item_id);
                }
                else{
                    promptContinueShopping();
                }
            });
        }else{
            console.log(`----------------------------------------------------------------------------`);
            console.log(`Sorry we dont have any ${productName}s in stock`);
            console.log(`----------------------------------------------------------------------------`);
            promptContinueShopping();
        }
    });      
}

let addItemToCart = (quantityInDatabase,quantity,itemId)=>{
    connection.query('UPDATE products SET stock_quantity = ? WHERE item_id=?',[quantityInDatabase-quantity,itemId],function(err){
        if(err) throw err;
        
        cartTotal(quantity,itemId);

    })
}


//prints cart total
let cartTotal = (quantity,itemId)=>{
    connection.query('SELECT price FROM products WHERE item_id=?',[itemId],(err,res)=>{
        if(err) throw err;
        let itemPrice = res[0].price;
        updateProductSales(itemPrice,quantity,itemId);
        total += itemPrice * quantity;
        console.log(`----------------------------------------------------------------------------`);
        console.log(`Cart total: ${total.toFixed(2)}`);
        console.log(`----------------------------------------------------------------------------`);
            promptContinueShopping();

    })
}

let updateProductSales = (itemPrice,quantity,itemId)=>{
    connection.query('SELECT product_sales FROM products WHERE item_id=?',[itemId],(err,data)=>{
        if (err) throw err;
        let totalProductSales = itemPrice*quantity+data[0].product_sales;
   
        connection.query('UPDATE products SET product_sales=? WHERE item_id=?',[totalProductSales,itemId],(err)=>{
            if(err) throw err;
        });
    });
}

let promptContinueShopping = ()=>{
    inquirer.prompt([
        {
            type: 'list',
            message: 'Would like to continue shopping?',
            choices: ['Yes','No'],
            name: 'confirm'
        }
    ]).then((answer)=>{
            if (answer.confirm === 'Yes'){

                inquirer.prompt([
                    {
                        type: 'number',
                        message: 'Choose an ID number of the product you would like to buy',
                        name: 'itemId'
                    },
                    {
                        type: 'number',
                        message: 'How many units of the product would you like to buy?',
                        name: 'quantity'
                    },
                    {
                        type: 'list',
                        message: 'Are you sure?',
                        choices:['Yes','No'],
                        name: 'confirm'
                    }
                ]).then((answers)=>{
                    if(answers.confirm === 'Yes'){
                        checkInventory(answers.itemId,answers.quantity);
                    }else{
                        promptContinueShopping();
                    }
                })
            }else if(answer.confirm === 'No' && total > 0){
                console.log(`----------------------------------------------------------------------------`);
                console.log(`Your total comes out to ${total}`)
                console.log('Thank You for shopping at Bamazon, come again!');
                console.log(`----------------------------------------------------------------------------`);
                connection.end();
            }else{
                console.log(`----------------------------------------------------------------------------`);
                console.log('Thank You for shopping at Bamazon, come again!');
                console.log(`----------------------------------------------------------------------------`);
                connection.end();
            }
    })
}

